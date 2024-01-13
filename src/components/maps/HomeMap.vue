<script setup>
import { onMounted, ref, watch, computed } from "vue"
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"
import { useScreenSizeStore } from "../../stores/screenSize.js"
import { debounce } from "../../utils/debounce.js"

const screenSize = useScreenSizeStore()
const graph = useGraphStore()

onMounted(() => {
  createStaticMapElements()
  // With the next line, we make sure that if the /map?q=... route is directly accessed,
  // the dynamic map is only drawn when the watcher triggers it. Otherwise, we draw
  // the map before the search component could query and transform the data

  // If the component is mounted after searching on the home page,
  // numberOfGraphs is !== 0, the data has been queried, and the map can be drawn
  graph.numberOfGraphs === 0 ? null : drawDynamicMap()
})

watch(
  () => graph.numberOfGraphs,
  () => {
    drawDynamicMap()
  }
)

watch(
  () => screenSize.width,
  () => {
    debouncedResize()
  }
)

const debouncedResize = debounce(() => {
  d3.select("#svg-chart").remove()
  createStaticMapElements()
  drawDynamicMap()
}, 500)

// The main functions handling the creation of the map
//////////////////////////////////////////////////////
function createStaticMapElements() {
  initiateSvg()
  setXScale()
  addMapGroups()
}

function drawDynamicMap() {
  setYScales()
  setCircularValues()
  drawWorks(graph.homeMapGraph.works)
  drawSDGs(graph.homeMapGraph.sdgs)
  drawConcepts(graph.homeMapGraph.concepts.reverse())
}

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)
const screenFactor = 0.8
// The total 'height' of the usable chart area (from top do down)
const totalHeight = computed(() => screenSize.height * screenFactor - screenSize.ctrMarginV * 2)

// SVG initiation with container /////////////////////////////////////
function initiateSvg() {
  // Draw <svg> canvas
  svg.value = d3
    .select("#home-map")
    .append("svg")
    .attr("id", "svg-chart")
    .attr("viewBox", `0 0 ${screenSize.width} ${screenSize.height * screenFactor}`)

  // Add <g> container with margins to avoid overlapping
  ctr.value = svg.value
    .append("g")
    .attr("id", "chart-container")
    .attr("transform", `translate(${screenSize.ctrMarginH}, ${screenSize.ctrMarginV})`)
}

// Scales and corresponding groups ///////////////////////////////////
// No visible axes needed ////////////////////////////////////////////

// xScale ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const xScale = ref(null)

function setXScale() {
  xScale.value = d3
    .scaleBand()
    .domain(["sdgs", "works", "concepts"])
    .align(0.5)
    .range([0, screenSize.width - screenSize.ctrMarginH * 2])
}

// yScales ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const yScaleWorks = ref(null)

function getYScaleRange(scale) {
  if (screenSize.isMobile) {
    // For small screens
    // The works will be shown in the bottom half
    // SDGs and concepts will be shown in the top half
    return scale === "works"
      ? [totalHeight.value * 0.5, totalHeight.value]
      : [0, totalHeight.value * 0.5]
  }
  // For big screens
  return [0, totalHeight.value]
}

function setYScaleWorks() {
  yScaleWorks.value = d3
    .scaleBand()
    .domain(graph.homeMapGraph.works.map((work) => work.id))
    .paddingInner(0.25)
    .align(0.5)
    .range(getYScaleRange("works"))
}

function setYScales() {
  setYScaleWorks()
}

// Draw elements /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const theBlack = "#333447"

// Element groups ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const SDGsGroup = ref(null)
const worksGroup = ref(null)
const conceptsGroup = ref(null)

function addSDGsGroup(xScaleFunction) {
  // SDGs group
  SDGsGroup.value = ctr.value
    .append("g")
    .attr("class", "sdgs-group")
    .attr("transform", `translate(${xScaleFunction("sdgs")}, 0)`)
}

function addWorksGroup(xScaleFunction) {
  // Wokrs group
  worksGroup.value = ctr.value
    .append("g")
    .attr("class", "works-group")
    .attr("transform", `translate(${xScaleFunction("works")}, 0)`)
}

function addConceptsGroup(xScaleFunction) {
  // Concepts group
  conceptsGroup.value = ctr.value
    .append("g")
    .attr("class", "concepts-group")
    .attr("transform", `translate(${xScaleFunction("concepts")}, 0)`)
}

function addMapGroups() {
  addSDGsGroup(xScale.value)
  addWorksGroup(xScale.value)
  addConceptsGroup(xScale.value)
}

// Draw works ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawWorks(data) {
  worksGroup.value
    .selectAll("g")
    .data(data)
    .join(
      // Handling data-dependent elements
      (enter) =>
        enter
          .append("g")
          .attr("class", "work")
          .attr("id", (d) => `work-${d.id}`)
          .each(function () {
            // Add rectangles
            d3.select(this).append("rect")
            // Add work title
            d3.select(this)
              .append("text")
              .text((d) => d.title)
              .attr("cursor", "default")
            d3.select(this).append("rect").attr("class", "work-rect")
          }),
      (update) => {
        return update.select("text").text((d) => d.title)
      },
      (exit) => exit.remove()
    )

  // Positioning each <g> element with class "work" along the yScaleWorks
  worksGroup.value.selectAll("g.work").attr("transform", (d) => {
    const translate0 = screenSize.isMobile ? `-${xScale.value.bandwidth() * screenFactor}` : 0
    return `translate(${translate0}, ${yScaleWorks.value(d.id)})`
  })

  // Handling the <rect> elements inside each g.work
  worksGroup.value
    .selectAll("g.work rect")
    .attr("width", () => {
      return screenSize.isMobile
        ? xScale.value.bandwidth() + 2 * xScale.value.bandwidth() * screenFactor
        : xScale.value.bandwidth()
    })
    .attr("height", yScaleWorks.value.bandwidth())
    .attr("stroke", theBlack)
    .attr("fill", theBlack)

  worksGroup.value.selectAll("rect.work-rect").attr("fill-opacity", 0).attr("cursor", "pointer")

  // Handling the <text> elements of the work title
  worksGroup.value
    .selectAll("g.work text")
    .attr("x", xScale.value.bandwidth() * 0.01)
    .attr("y", yScaleWorks.value.bandwidth() * 0.85)
    .attr("font-size", () => {
      return yScaleWorks.value.bandwidth() * 0.95
    })
    .attr("fill", "white")
}

// Calculate the circular values to place SDG and concept elements
//////////////////////////////////////////////////////////////////////
const adjacent = ref(null)
const countercathete = ref(null)
const radius = ref(null)
const alpha = ref(null)

const sdgDegrees = ref(null)
const sdgStart = ref(null)

const conceptDegrees = ref(null)
const conceptStart = ref(null)

const circleElementRadius = ref(null)
const textElementXOffset = ref(null)

// To convert from Polar Coordinates (r,θ) to Cartesian Coordinates (x,y):
// x = r * cos(θ)
// y = r * sin(θ)

function setCircularValues() {
  adjacent.value = screenSize.width * 1.5 // desired x, a.k.a. the center adjustment
  countercathete.value = totalHeight.value * 0.45 // desired y
  radius.value = Math.sqrt(Math.pow(adjacent.value, 2) + Math.pow(countercathete.value, 2)) // The radius is the hypotenuse
  alpha.value = Math.tan(countercathete.value / adjacent.value) * (180 / Math.PI) // In degrees

  sdgDegrees.value = (alpha.value * 2) / (graph.homeMapGraph.sdgs.length - 1) // The gaps between the SDG elements
  sdgStart.value = 180 - alpha.value // The starting angle of the SDG elements (on a regular cartesian coordinate system)

  conceptDegrees.value = (alpha.value * 2) / (graph.homeMapGraph.concepts.length - 1) // The gaps between the concept elements
  conceptStart.value = 360 - alpha.value // The starting angle of the SDG elements (on a regular cartesian coordinate system)

  circleElementRadius.value = yScaleWorks.value.bandwidth() * 0.5
  textElementXOffset.value = circleElementRadius.value * 2
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

function getCircularX(element, startDegree, radius, angle, i) {
  const circularX = radius * Math.cos(degToRad(startDegree) + degToRad(angle * i))
  // Depending on the startDegree, circularX might have a negative value (e.g. for SDGs)!!
  const centerAdjustment = element === "sdg" ? adjacent.value : -adjacent.value
  const margin =
    element === "sdg" ? xScale.value.bandwidth() * 0.75 : xScale.value.bandwidth() * 0.25
  return centerAdjustment + circularX + margin // Add some margin
}

function getCircularY(startDegree, radius, angle, i) {
  const circularY = radius * Math.sin(degToRad(startDegree) + degToRad(angle * i))
  // Adjustment for y center + the calculated y (which is negative because SVG 0/0 is top left)
  return totalHeight.value * 0.5 + -circularY
}

// Draw SDGs /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function getSdgId(d) {
  return `SDG ${d.id}`
}

function getSdgLabel(d) {
  return d.name
}

function drawSDGs(data) {
  SDGsGroup.value
    .selectAll("g")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "sdg")
          .each(function () {
            // Add circles
            d3.select(this)
              .append("circle")
              .attr("stroke", (d) => d.color)
              .attr("fill", (d) => d.color)
            // Add SDG ID
            d3.select(this)
              .append("text")
              .attr("class", "sdg-id")
              .text((d) => getSdgId(d))
              .attr("x", -textElementXOffset.value)
              .attr("y", "0")
              .attr("dominant-baseline", "text-after-edge")
              .attr("text-anchor", "end")
            // Add SDG label
            d3.select(this)
              .append("text")
              .attr("class", "sdg-label")
              .text((d) => getSdgLabel(d))
              .attr("x", -textElementXOffset.value)
              .attr("y", "0")
              .attr("dominant-baseline", "text-before-edge")
              .attr("font-size", "0.75em")
              .attr("text-anchor", "end")
          }),
      (update) => {
        update
          .selectAll("sdg-id")
          .text((d) => getSdgId(d))
          .attr("x", -textElementXOffset.value)
          .attr("y", "0")
        update
          .selectAll("sdg-label")
          .text((d) => getSdgLabel(d))
          .attr("x", -textElementXOffset.value)
        update
          .select("circle")
          .attr("stroke", (d) => d.color)
          .attr("fill", (d) => d.color)
        return update
      },
      (exit) => exit.remove()
    )

  SDGsGroup.value
    .selectAll("g.sdg")
    .attr(
      "transform",
      (_, i) =>
        `translate(${getCircularX(
          "sdg",
          sdgStart.value,
          radius.value,
          sdgDegrees.value,
          i
        )}, ${getCircularY(sdgStart.value, radius.value, sdgDegrees.value, i)})`
    )

  // Position the SDG circles
  SDGsGroup.value
    .selectAll("g.sdg circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", circleElementRadius.value)
}

// Draw Concepts /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawConcepts(data) {
  conceptsGroup.value
    .selectAll("g")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "concept")
          .each(function () {
            // Add circles
            d3.select(this).append("circle").attr("stroke", theBlack).attr("fill", theBlack)
            // Add concept
            d3.select(this)
              .append("text")
              .attr("class", "concept-name")
              .text((d) => d.name)
              .attr("x", textElementXOffset.value)
              .attr("y", "0")
              .attr("dominant-baseline", "middle")
          }),
      (update) => {
        update.selectAll("concept-name").text((d) => d.name)
        return update
      },
      (exit) => exit.remove()
    )

  conceptsGroup.value
    .selectAll("g.concept")
    .attr(
      "transform",
      (_, i) =>
        `translate(${getCircularX(
          "concept",
          conceptStart.value,
          radius.value,
          conceptDegrees.value,
          i
        )}, ${getCircularY(conceptStart.value, radius.value, conceptDegrees.value, i)})`
    )

  // Position the concept circles
  conceptsGroup.value
    .selectAll("g.concept circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", circleElementRadius.value)
}

// Draw SDG-works lines //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Add works mouseovers //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Add SDG mouseovers ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Add concepts mouseovers ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Add work click events /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Add SDG click events //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Add concepts click events /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
</script>

<template>
  <div id="home-map"></div>
</template>
