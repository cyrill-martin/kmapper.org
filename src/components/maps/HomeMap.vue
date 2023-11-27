<script setup>
import { onMounted, ref, watch } from "vue";
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"
import { useScreenSizeStore } from "../../stores/screenSize.js";
import { debounce } from "../../utils/debounce.js"

const screenSize = useScreenSizeStore()
const graph = useGraphStore()

onMounted(() => {
  createStaticMapElements()
})

watch(() => graph.numberOfGraphs, () => {
  drawDynamicMap()
})

watch(() => screenSize.width, () => {
  debouncedResize();
})

const debouncedResize = debounce(() => {
  d3.select("#svg-chart").remove();
  createStaticMapElements();
  drawDynamicMap();
}, 500);

// The main functions handling the creation of the map
/////////////////////////////////////////////////////
function createStaticMapElements() {
  initiateSvg()
  setXScale()
  addMapGroups()
}

function drawDynamicMap() {
  setYScales()
  drawWorks(graph.homeMapGraph.works)
}

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)

const screenFactor = 0.8

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
    .attr(
      "transform",
      `translate(${screenSize.ctrMarginH}, ${screenSize.ctrMarginV})`
    )
}

// Scales and corresponding groups ///////////////////////////////////
// No visible axes needed ////////////////////////////////////////////

// xScale ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const xScale = ref(null)

function setXScale() {
  xScale.value = d3.scaleBand()
    .domain(["sdgs", "works", "concepts"])
    .align(0.5)
    .range([0, screenSize.width - (screenSize.ctrMarginH * 2)])
}

// yScales ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const yScaleSDGs = ref(null)
const yScaleWorks = ref(null)
const yScaleConepts = ref(null)

function getYScaleRange(scale) {
  // The total 'height' of the usable chart area (from top do down)
  const totalHeight = screenSize.height * screenFactor - (screenSize.ctrMarginV * 2)

  if (screenSize.isMobile) { // For small screens
    // The works will be shown in the bottom half
    // SDGs and concepts will be shown in the top half
    return scale === "works" ? [totalHeight / 2, totalHeight] : [0, totalHeight / 2];
  }
  // For big screens
  return [0, totalHeight];
}

function setYScaleSDGs() {
  yScaleSDGs.value = d3.scaleBand()
    .domain(graph.homeMapGraph.sdgs.map((sdg) => sdg.id))
    .align(0.5)
    .range(getYScaleRange("sdgs"))
}

function setYScaleWorks() {
  yScaleWorks.value = d3.scaleBand()
    .domain(graph.homeMapGraph.works.map((work) => work.id))
    .paddingInner(0.25)
    .align(0.5)
    .range(getYScaleRange("works"))
}

function setYScaleConcepts() {
  yScaleConepts.value = d3.scaleBand()
    .domain(graph.homeMapGraph.concepts.map((concept) => concept.name))
    .align(0.5)
    .range(getYScaleRange("concepts"))
}

function setYScales() {
  setYScaleSDGs()
  setYScaleWorks()
  setYScaleConcepts()
}

// Draw elements /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const theBlack = "rgb(59 69 78)"
const fontSizeWorks = 12

// Element groups ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const SDGsGroup = ref(null)
const worksGroup = ref(null)
const conceptsGroup = ref(null)

function addSDGsGroup(xScaleFunction) { // SDGs group
  SDGsGroup.value = ctr.value
    .append("g")
    .attr("class", "sdgs-group")
    .attr("transform", `translate(${xScaleFunction("sdgs")}, 0)`)
}

function addWorksGroup(xScaleFunction) { // Wokrs group
  worksGroup.value = ctr.value
    .append("g")
    .attr("class", "works-group")
    .attr("transform", `translate(${xScaleFunction("works")}, 0)`)
}

function addConceptsGroup(xScaleFunction) { // Concepts group
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

// Draw works  ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function drawWorks(data) {
  worksGroup.value
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("class", "work")
    .attr("transform", (d) => {
      const translate0 = screenSize.isMobile ? `-${xScale.value.bandwidth() * screenFactor}` : 0
      return `translate(${translate0}, ${yScaleWorks.value(d.id)})`
    })
    // eslint-disable-next-line no-unused-vars
    .each(function (d) {
      d3.select(this) // Add rectangles
        .append("rect")
        .attr("width", () => {
          return screenSize.isMobile ? (xScale.value.bandwidth() + (2 * xScale.value.bandwidth() * screenFactor)) : xScale.value.bandwidth()
        })
        .attr("height", yScaleWorks.value.bandwidth())
        .attr("stroke", theBlack)
        .attr("fill", theBlack)

      d3.select(this) // Add work title
        .append("text")
        .text((d) => d.title)
        .attr("x", xScale.value.bandwidth() * 0.005)
        .attr("y", yScaleWorks.value.bandwidth() * 0.75)
        .attr("font-size", fontSizeWorks)
        .attr("fill", "white")
    })
}

</script>

<template>
  <div id="home-map"></div>
</template>