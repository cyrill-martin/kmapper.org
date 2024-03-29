import { ref } from "vue"
import { defineStore } from "pinia"

export const useGraphStore = defineStore("graph", () => {
  // Graph state
  const numberOfGraphs = ref(0)

  const homeMapGraph = ref(null)
  const sdgWorkNodes = ref(null)
  const fieldWorkNodes = ref(null)

  const detailsMapGraph = ref(null)

  // Actions
  function setHomeMapGraph(data) {
    homeMapGraph.value = data
  }

  function setSdgWorkNodes(data) {
    sdgWorkNodes.value = data
  }

  function setFieldWorkNodes(data) {
    fieldWorkNodes.value = data
  }

  function incrementNumberOfGraphs() {
    numberOfGraphs.value++
  }

  function setDetailsMapGraph(data) {
    detailsMapGraph.value = data
  }

  function resetDetailsMapGraph() {
    detailsMapGraph.value = null
  }

  return {
    numberOfGraphs,
    homeMapGraph,
    sdgWorkNodes,
    fieldWorkNodes,
    detailsMapGraph,
    setHomeMapGraph,
    setSdgWorkNodes,
    setFieldWorkNodes,
    incrementNumberOfGraphs,
    setDetailsMapGraph,
    resetDetailsMapGraph
  }
})
