<script setup>
import { defineAsyncComponent, onMounted, } from "vue"
const DetailsMap = defineAsyncComponent(() =>
  import("./DetailsMap.vue")
)
import { useGraphStore } from "../../stores/graph.js"
import { createDetailsMapGraph } from "../../utils/createDetailsMapGraph.js"

// Use props
const props = defineProps(["inputObj"]) // E.g. {type: 'sdgs', root: {...}, sizes: {...} }

// Use stores
const graph = useGraphStore()

onMounted(async () => {
  const detailsData = await createDetailsMapGraph(props.inputObj)
  graph.setDetailsMapGraph(detailsData)
})
</script>

<template>
  <div>
    <DetailsMap
      v-if="graph.detailsMapGraph"
      :sizes="props.inputObj.sizes"
    ></DetailsMap>
  </div>
</template>
