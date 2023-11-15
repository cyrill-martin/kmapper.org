<script setup>
import { onMounted, ref, watch } from "vue";
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"

const graph = useGraphStore()

onMounted(() => {
  console.log("onMounted")
  createMap(graph.homeMapGraph)
})

watch(() => graph.numberOfGraphs, () => {
  console.log("changed home map graph")
  createMap(graph.homeMapGraph)
});

// Main SVG //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// SVG Dimensions ////////////////////////////////////////////////////
const dimensions = {
  width: 1400,
  height: 700,
  margin: { top: 50, bottom: 50, left: 50, right: 50 },
  ctrWidth: null,
  ctrHeight: null
}
// Add container width and height for the later created container
dimensions.ctrWidth = dimensions.width - (dimensions.margin.left + dimensions.margin.right)
dimensions.ctrHeight = dimensions.height - (dimensions.margin.top + dimensions.margin.bottom)

// Main SVG elements /////////////////////////////////////////////////
const svg = ref(null)
const ctr = ref(null)

function createMap(data) {
  initiateSvg()
  console.log(data)
}

// SVG initiation with container /////////////////////////////////////
function initiateSvg() {
  // Draw <svg> canvas
    svg.value = d3
    .select("#home-map")
    .append("svg")
    .attr("id", "svg-chart")
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)

  // Add <g> container with margins to avoid overlapping
    ctr.value = svg.value
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    )
}

// Axes //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// const numberOfSDGs = computed(() => {
//   return graph.homeMapGraph.sdgs.length
// })

// const numberOfWorks = computed(() => {
//   return graph.homeMapGraph.works.length
// })

// const numberOfConcepts = computed(() => {
//   return graph.homeMapGraph.concepts.length
// })

// console.log(numberOfSDGs, numberOfWorks, numberOfConcepts)

</script>

<template>
  <div id="home-map"></div>
</template>