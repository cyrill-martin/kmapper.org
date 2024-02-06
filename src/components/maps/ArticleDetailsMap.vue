<script setup>
import { useGraphStore } from "../../stores/graph.js"

const graph = useGraphStore()
</script>

<template>
  <div v-if="graph.articleDetailsMapGraph">Article!! {{ graph.articleDetailsMapGraph }}</div>
</template>
