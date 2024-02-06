<script setup>
import { useGraphStore } from "../../stores/graph.js"

const graph = useGraphStore()
</script>

<template>
  <div v-if="graph.elementDetailsMapGraph">Element!! {{ graph.elementDetailsMapGraph }}</div>
</template>
