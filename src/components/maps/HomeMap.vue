<script setup>
import { onMounted, ref } from "vue";
// eslint-disable-next-line
import * as d3 from "d3"

// import { useMapsStore } from "../../stores/maps";

// Maps store
// const mapsStore = useMapsStore()

// Initiate the SVG

// Data
const dimensions = {
  width: 1400,
  height: 700,
  margin: {
    top: 50,
    bottom: 80,
    left: 80,
    right: 310,
  }
}

// Add a width for the up to come container inside the up to come svg image
dimensions.ctrWidth = dimensions.width - (dimensions.margin.left + dimensions.margin.right)

// Add a height for the up to come container inside the up to come svg image
dimensions.ctrHeight = dimensions.height - (dimensions.margin.top + dimensions.margin.bottom)

const svg = ref(null)
const ctr = ref(null)

function createSvg() {
  // Draw <svg> canvas
    svg.value = d3
    .select("#home-map")
    .append("svg")
    .attr("id", "svg-chart")
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)

  // Add <g> container with margins
  ctr.value = svg.value
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    )
}

onMounted(() => {
  createSvg()
})

</script>

<template>
  <div id="home-map"></div>
</template>