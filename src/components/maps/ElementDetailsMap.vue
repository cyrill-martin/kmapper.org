<script setup>
import { useGraphStore } from "../../stores/graph.js"

const graph = useGraphStore()
</script>

<template>
  <div v-if="graph.detailsMapGraph">Element!! {{ graph.detailsMapGraph }}</div>
</template>
