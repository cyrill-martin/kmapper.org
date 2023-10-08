<script setup>
import { onMounted, ref } from "vue";
// eslint-disable-next-line
import * as d3 from "d3"
// import { useMapsStore } from "../../stores/maps";

// Maps store
// const mapsStore = useMapsStore()

onMounted(() => {
  initiateSvg() // Initiate the SVG canvas
  // Continue to draw the visualization with according functions
  // console.log(mapsStore.homeMapData)
})

//////////////////////////////////////////////////////////////////////////
// Initiate the SVG //////////////////////////////////////////////////////
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

const svg = ref(null)
const ctr = ref(null)

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
//////////////////////////////////////////////////////////////////////////
</script>

<template>
  <div id="home-map"></div>
</template>