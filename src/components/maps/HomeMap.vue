<script setup>
import { onMounted, ref, watch } from "vue";
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"
import { useScreenSizeStore } from "../../stores/screenSize.js";

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

const debouncedResize = screenSize.debounce(() => {
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
  drawWorks(graph.homeMapGraph)
}

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)

// SVG initiation with container /////////////////////////////////////
function initiateSvg() {
  // Draw <svg> canvas
  svg.value = d3
    .select("#home-map")
    .append("svg")
    .attr("id", "svg-chart")
    .attr("viewBox", `0 0 ${screenSize.width} ${screenSize.height * 0.8}`)

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
//////////////////////////////////////////////////////////////////////
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

function getYScaleRange() {
  return [0, screenSize.height * 0.8 - (screenSize.ctrMarginV * 2)]
}

function setYScaleSDGs() {
  yScaleSDGs.value = d3.scaleBand()
    .domain(graph.homeMapGraph.sdgs.map((sdg) => sdg.id))
    .align(0.5)
    .range(getYScaleRange())
}

function setYScaleWorks() {
  yScaleWorks.value = d3.scaleBand()
    .domain(graph.homeMapGraph.works.map((work) => work.id))
    .paddingInner(0.25)
    .align(0.5)
    .range(getYScaleRange())
}

function setYScaleConcepts() {
  yScaleConepts.value = d3.scaleBand()
    .domain(graph.homeMapGraph.concepts.map((concept) => concept.name))
    .align(0.5)
    .range(getYScaleRange())
}

function setYScales() {
  setYScaleSDGs()
  setYScaleWorks()
  setYScaleConcepts()
}


const SDGsGroup = ref(null)
const worksGroup = ref(null)
const conceptsGroup = ref(null)

function addSDGsGroup(xScaleFunction) {
  SDGsGroup.value = ctr.value
    .append("g")
    .attr("class", "sdgs-group")
    .attr("transform", `translate(${xScaleFunction("sdgs")}, 0)`);
}

function addWorksGroup(xScaleFunction) {
  worksGroup.value = ctr.value
    .append("g")
    .attr("class", "works-group")
    .attr("transform", `translate(${xScaleFunction("works")}, 0)`);
}

function addConceptsGroup(xScaleFunction) {
  conceptsGroup.value = ctr.value
    .append("g")
    .attr("class", "concepts-group")
    .attr("transform", `translate(${xScaleFunction("concepts")}, 0)`);
}

function addMapGroups() {
  addSDGsGroup(xScale.value)
  addWorksGroup(xScale.value)
  addConceptsGroup(xScale.value)
}

// Draw elements /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const theBlack = "rgb(59 69 78)"
const fontSizeWorks = 12

// Draw works  ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function drawWorks(data) {
  worksGroup.value
    .selectAll("g")
    .data(data.works)
    .join("g")
    .attr("class", "work")
    .attr("transform", (d) => `translate(0, ${yScaleWorks.value(d.id)})`)
    // eslint-disable-next-line no-unused-vars
    .each(function (d) {
      d3.select(this)
        .append("rect")
        .attr("width", xScale.value.bandwidth())
        .attr("height", yScaleWorks.value.bandwidth())
        .attr("stroke", theBlack)
        .attr("fill", theBlack)

      d3.select(this)
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