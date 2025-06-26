<script setup>
import { usePaperSpaceStore } from "../stores/paperSpace.js"
const paperSpace = usePaperSpaceStore()
</script>
<template>
  {{ paperSpace.papers }}
</template>
