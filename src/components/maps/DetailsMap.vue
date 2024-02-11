<script setup>
import { onMounted, ref, computed } from "vue"
// eslint-disable-next-line
import * as d3 from "d3"
import { useScreenSizeStore } from "../../stores/screenSize.js"
import { useGraphStore } from "../../stores/graph.js"

const props = defineProps(["sizes"])

// Use stores
const screenSize = useScreenSizeStore()
const graph = useGraphStore()

onMounted(() => {
  getAvailableModalWidth()
  // Create the static, screen-dependent map elements
  createStaticMapElements()
  drawDynamicMap()
  console.log("Sizes", props.sizes)
  console.log("detailsMapGraph", graph.detailsMapGraph)
})

function getAvailableModalWidth() {
  const modalContent = d3.select("#details-map")
  mapWidth.value = modalContent.style("width").replace("px", "")
}

// The main functions handling the creation of the map ///////////////
//////////////////////////////////////////////////////////////////////

// Creating the static, only screen-dependent map elements
function createStaticMapElements() {
  initiateSvg()
  addMapGroups()
}

function drawDynamicMap() {
  drawTitle()
  drawFirstGroupContent()
}

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)
const ctrMargin = 0

// The total height of the usable map area shouldn't be the same as the total screen height
// A fraction of the available screen height is used to account for header elements and avoid...
// a map that is not completely visible
const mapHeight = computed(() => {
  if (graph.detailsMapGraph.type === "works") {
    const maxSecondChildren = d3.max(
      graph.detailsMapGraph.children.map((child) => child.data.children.length)
    )
    return screenSize.isMobile
      ? titleGroupHeight +
          elementBaseDistance * graph.detailsMapGraph.children.length +
          maxSecondChildren * worksBaseDistance
      : titleGroupHeight + maxSecondChildren * worksBaseDistance
  } else return 5000
})

const mapWidth = ref(null)

// SVG initiation with container /////////////////////////////////////
function initiateSvg() {
  // Draw <svg> canvas
  svg.value = d3
    .select("#details-map")
    .append("svg")
    .attr("id", "svg-details-chart")
    .attr("viewBox", `0 0 ${mapWidth.value} ${mapHeight.value}`)

  // Add <g> container with margins to avoid overlapping
  ctr.value = svg.value
    .append("g")
    .attr("id", "details-chart-container")
    .attr("transform", `translate(${ctrMargin}, ${ctrMargin})`)
}

function addMapGroups() {
  addTitleGroup()
  addFirstGroup()
  addSecondGroup()
}

// Groups ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const titleGroup = ref(null)
const firstGroup = ref(null)
const secondGroup = ref(null)

const theBlack = "#333447"
const theBlue = "#514efd"
const theGrey = "lightgrey"
const lineWidth = "1.5px"
const titleGroupHeight = props.sizes.worksBandwidth * 5
const elementBaseDistance = props.sizes.worksBandwidth * 3
const worksBaseDistance = props.sizes.worksBandwidth * 1.5
const circleRadius = props.sizes.worksBandwidth * 0.5
const textElementXOffset = props.sizes.worksBandwidth * 0.5 * 2

function getSecondGroupTranslation() {
  if (screenSize.isMobile) {
    const nrOfChildren = graph.detailsMapGraph.children.length
    const baseDistance =
      graph.detailsMapGraph.type === "works" ? elementBaseDistance : worksBaseDistance
    return `translate(0, ${titleGroupHeight + baseDistance * nrOfChildren})`
  } else {
    return `translate(${mapWidth.value * 0.5}, ${titleGroupHeight})`
  }
}

function addTitleGroup() {
  titleGroup.value = ctr.value
    .append("g")
    .attr("class", "details-title-group")
    .attr("transform", `translate(0, 0)`)
}

function addFirstGroup() {
  firstGroup.value = ctr.value
    .append("g")
    .attr("class", "details-elements-group")
    .attr("transform", `translate(0, ${titleGroupHeight})`)
}

function addSecondGroup() {
  secondGroup.value = ctr.value
    .append("g")
    .attr("class", "details-works-group")
    .attr("transform", getSecondGroupTranslation())
}

// Draw titles ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawTitle() {
  if (graph.detailsMapGraph.type === "works") {
    drawWorksTitle()
  } else if (graph.detailsMapGraph.type === "sdgs") {
    drawSdgTitle()
  } else {
    drawConceptTitle()
  }
}

function drawWorksTitle() {
  titleGroup.value.append("g").append("rect").attr("class", "title-rect")

  titleGroup.value.append("text").attr("class", "title").text(graph.detailsMapGraph.data.title)

  titleGroup.value
    .append("rect")
    .attr("class", "title-rect-overlay")
    .append("title")
    .text(graph.detailsMapGraph.data.title)

  titleGroup.value
    .selectAll(".title-rect,.title-rect-overlay")
    .attr("width", () => mapWidth.value)
    .attr("height", props.sizes.worksBandwidth)

  titleGroup.value.selectAll(".title-rect").attr("stroke", theBlack).attr("fill", theBlack)

  titleGroup.value
    .selectAll(".title-rect-overlay")
    .attr("fill-opacity", 0)
    .attr("cursor", "pointer")

  titleGroup.value
    .selectAll(".title")
    .attr("x", 5)
    .attr("y", props.sizes.worksBandwidth * 0.85)
    .style("font-size", props.sizes.workTitle)
    .attr("fill", "white")
}

function drawSdgTitle() {
  const sdgGroup = titleGroup.value
    .append("g")
    .attr("transform", `translate(${props.sizes.worksBandwidth}, ${props.sizes.worksBandwidth})`)

  sdgGroup
    .append("circle")
    .attr("class", "sdg-title-circle")
    .attr("r", circleRadius)
    .attr("stroke", theBlack)
    .attr("fill", theBlack)

  sdgGroup
    .append("text")
    .attr("class", "sdg-title-id")
    .text(`SDG ${graph.detailsMapGraph.data.id}`)
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .style("font-size", `${props.sizes.sdgId}px`)
    .attr("dominant-baseline", "text-after-edge")
    .attr("text-anchor", "start")

  sdgGroup
    .append("rect")
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .attr("fill", graph.detailsMapGraph.data.color)
    .attr("opacity", 0.4)
    .attr("width", graph.detailsMapGraph.data.labelBbox.width)
    .attr("height", graph.detailsMapGraph.data.labelBbox.height)

  sdgGroup
    .append("text")
    .text(graph.detailsMapGraph.data.name)
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .attr("dominant-baseline", "text-before-edge")
    .style("font-size", props.sizes.sdgLabel)
    .attr("text-anchor", "start")
}

function drawConceptTitle() {
  const conceptGroup = titleGroup.value
    .append("g")
    .attr("transform", `translate(${props.sizes.worksBandwidth}, ${props.sizes.worksBandwidth})`)

  conceptGroup
    .append("circle")
    .attr("class", "concept-title-circle")
    .attr("r", circleRadius)
    .attr("stroke", theBlack)
    .attr("fill", theBlack)

  conceptGroup
    .append("text")
    .attr("class", "concept-title-name")
    .text(graph.detailsMapGraph.data.name)
    .attr("x", textElementXOffset)
    .attr("y", 0)
    .style("font-size", `${props.sizes.concept}px`)
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "start")
}

// Draw first group //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawFirstGroupContent() {
  if (graph.detailsMapGraph.type === "works") {
    drawLinesInFirstGroup(
      graph.detailsMapGraph.children,
      drawElementsInFirstGroup,
      drawWorksInSecondGroup
    )
  } else {
    drawWorksInFirstGroup()
  }
}

function drawLinesInFirstGroup(data, callback1, callback2) {
  firstGroup.value
    .selectAll(".first-group-line")
    .data(data)
    .join((enter) =>
      enter
        .append("line")
        .attr("class", (_, i) => ["first-group-line", `element-${i}`].join(" "))
        .attr("stroke", (d) => (d.data.children.length ? theGrey : null))
        .attr("stroke-width", lineWidth)
        .attr("x1", 0)
        .attr("y1", (_, i) => i * elementBaseDistance)
        .attr("x2", () => (screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.4))
        .attr("y2", (_, i) => i * elementBaseDistance)
    )

  callback1(data, addMouseEvents, addExpandClickEvents) // callback1 is drawElementsInFirstGroup
  callback2()
}

function drawElementsInFirstGroup(data, callback1, callback2) {
  firstGroup.value
    .selectAll(".first-group-element")
    .data(data)
    .join((enter) =>
      enter
        .append("g")
        .attr("class", (_, i) => ["first-group-element", `element-${i}`].join(" "))
        .attr("transform", (_, i) => `translate(0, ${i * elementBaseDistance})`)
        .each(function (d, i) {
          if (d.type === "sdg") {
            // Trick to get the labelBox data of the SDG
            const sdg = graph.homeMapGraph.sdgs.find((sdg) => sdg.id === d.data.id)

            const sdgLabelGroup = d3
              .select(this)
              .append("g")
              .attr("class", ["group-element", `element-${i}`].join(" "))
              .attr("data-index", i)
              .attr("cursor", "pointer")

            // Add SDG ID
            sdgLabelGroup
              .append("text")
              .attr("class", "sdg-group-id")
              .text((d) => `SDG ${d.data.id}`)
              .style("font-size", `${props.sizes.sdgId}px`)
              .attr("dominant-baseline", "text-after-edge")
              .attr("text-anchor", "start")
            // Add rectangle for SDG label
            sdgLabelGroup
              .append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("fill", (d) => d.data.color)
              .attr("opacity", 0.4)
              .attr("width", sdg.labelBbox.width)
              .attr("height", sdg.labelBbox.height)
            // Add SDG label
            sdgLabelGroup
              .append("text")
              .text((d) => d.data.name)
              .attr("x", 0)
              .attr("y", 0)
              .attr("dominant-baseline", "text-before-edge")
              .style("font-size", props.sizes.sdgLabel)
              .attr("text-anchor", "start")
          } else {
            // Add concept
            const conceptLabelGroup = d3
              .select(this)
              .append("g")
              .attr("class", ["group-element", `element-${i}`].join(" "))
              .attr("data-index", i)
              .attr("cursor", "pointer")

            conceptLabelGroup
              .append("text")
              .attr("class", "concept-group-name")
              .text((d) => d.data.name)
              .style("font-size", `${props.sizes.concept}px`)
              .attr("dominant-baseline", "text-after-edge")
              .attr("text-anchor", "start")
          }

          // Add element children circle
          const circleGroup = d3
            .select(this)
            .append("g")
            .attr("class", ["group-element", `element-${i}`].join(" "))
            .attr("data-index", i)
            .attr(
              "transform",
              `translate(${screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.4},0)`
            )
            .attr("cursor", "pointer")

          if (d.data.children.length) {
            // Add actual circle with count, if children are available
            circleGroup
              .append("circle")
              .attr("r", circleRadius * 1.5)
              .attr("stroke", theBlack)
              .attr("fill", theBlack)

            circleGroup
              .append("text")
              .text((d) => d.data.children.length)
              .attr("fill", "white")
              .style("font-size", `${props.sizes.concept}px`)
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", "middle")
          }
        })
    )

  callback1() // callback1 is addMouseEvents()
  callback2() // callback2 is addExpandClickEvents()
}

function elementColor(type) {
  return type === "mouseover" ? theBlue : theBlack
}

function lineColor(type) {
  return type === "mouseover" ? theBlue : theGrey
}

function lineWwidth(type) {
  return type === "mouseover" ? "2.5px" : lineWidth
}

function fontWeight(type) {
  return type === "mouseover" ? "bold" : "regular"
}

function addMouseEvents() {
  firstGroup.value.selectAll(".group-element").on("mouseover mouseout", function (event) {
    const index = d3.select(this).attr("data-index")
    if (graph.detailsMapGraph.children[index].data.children.length) {
      // Highlighting and setting back the lines
      d3.selectAll(`line.element-${index}`)
        .attr("stroke", lineColor(event.type))
        .attr("stroke-width", lineWwidth(event.type))
    }
    // Highlighting and setting back element circles
    d3.selectAll(`.element-${index} circle`)
      .attr("stroke", elementColor(event.type))
      .attr("fill", elementColor(event.type))
    // Highlighting and setting back SDGs
    d3.selectAll(`.element-${index} .sdg-group-id`)
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))
    // // Highlighting and setting back concepts
    d3.selectAll(`.element-${index} .concept-group-name`)
      .attr("fill", elementColor(event.type))
      .attr("font-weight", fontWeight(event.type))
  })
}

function addExpandClickEvents() {
  firstGroup.value.selectAll(".group-element").on("click", function () {
    const index = d3.select(this).attr("data-index")
    if (graph.detailsMapGraph.children[index].data.children.length) {
      const shownWorks = graph.detailsMapGraph.children[index].data.children
      worksInSecondGroup.value = shownWorks
      drawWorksInSecondGroup()
    }
  })
}

const worksInSecondGroup = ref([])

function drawWorksInSecondGroup() {
  const shownWorksSelection = secondGroup.value
    .selectAll(".shown-work")
    .data(worksInSecondGroup.value, function (d) {
      return d
    })

  const enterShownWorks = shownWorksSelection
    .enter()
    .append("g")
    .attr("class", "shown-work")
    .attr("transform", () => {
      return `translate(0, -${worksBaseDistance})`
    })

  // Add rectangles
  enterShownWorks.append("rect").attr("class", () => ["shown-work-rect"].join(" "))
  // .attr("data-id", (d) => d.id)

  // Add work title
  enterShownWorks
    .append("text")
    .attr("class", "shown-work-title")
    // .attr("data-id", (d) => d.id)
    .text((d) => d.title)

  // Adding an overlay rectangle in order to handle mouse events
  enterShownWorks
    .append("rect")
    .attr("class", "shown-work-overlay")
    .data(worksInSecondGroup.value, function (_, i) {
      return i
    })
    .each(function () {
      // Adding a title element to achieche a standard HTML tooltip
      // Yes, I like the style of the standard tooltips!!
      d3.select(this)
        .append("title")
        .text((d) => d.title)
    })

  // Merge the enter and update selections
  const updateShownWorks = enterShownWorks.merge(shownWorksSelection)

  // Update the attributes of the text elements based on the new data
  updateShownWorks.select(".shown-work-title").text((d) => d.title)

  // Update the attributes of the overlay elements based on the new data
  updateShownWorks.select(".shown-work-overlay title").text((d) => d.title)

  // Select the elements that need to be removed
  const exitShownWorks = shownWorksSelection.exit()

  // Remove them from the DOM
  exitShownWorks.remove()

  secondGroup.value
    .selectAll(".shown-work-rect,.shown-work-overlay")
    .attr("width", () => {
      return screenSize.isMobile ? mapWidth.value * 0.9 : mapWidth.value * 0.5
    })
    .attr("height", props.sizes.worksBandwidth)

  secondGroup.value.selectAll(".shown-work-rect").attr("stroke", theBlack).attr("fill", theBlack)

  // Handling the overlay rect element for handling mouse events as well
  secondGroup.value
    .selectAll(".shown-work-overlay")
    .attr("class", () => ["work-overlay"].join(" "))
    // .attr("data-id", (d) => d.id)
    // .attr("data-type", "works")
    // .attr("data-index", (_, i) => i)
    .attr("fill-opacity", 0)
    .attr("cursor", "pointer")

  secondGroup.value
    .selectAll(".shown-work-title")
    .attr("x", 5)
    .attr("y", props.sizes.worksBandwidth * 0.85)
    .style("font-size", props.sizes.workTitle)
    .attr("fill", "white")

  secondGroup.value
    .selectAll(".shown-work")
    .transition()
    .duration(transitionDuration)
    .ease(easeAnimation)
    .attr("transform", (_, i) => {
      return `translate(0, ${worksBaseDistance * i})`
    })
}

// Handling the bouncing animation when a map is drawn
const transitionDuration = 1000
// The amplitude determines how far the curve goes above or below the endpoints,...
// while the period determines how often the curve oscillates.
const easeAnimation = d3.easeElasticOut.amplitude(1.0).period(0.4)

function drawWorksInFirstGroup() {}
</script>

<template>
  <div id="details-map"></div>
</template>
