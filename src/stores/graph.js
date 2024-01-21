import { ref } from "vue"
import { defineStore } from "pinia"

export const useGraphStore = defineStore("graph", () => {
  // Graph state
  const numberOfGraphs = ref(0)

  const homeMapGraph = ref(null)
  const sdgWorkNodes = ref(null)
  const conceptWorkNodes = ref(null)

  // Actions
  function setHomeMapGraph(data) {
    homeMapGraph.value = data
  }

  function setSdgWorkNodes(data) {
    sdgWorkNodes.value = data
  }

  function setConceptWorkNodes(data) {
    conceptWorkNodes.value = data
  }

  function incrementNumberOfGraphs() {
    numberOfGraphs.value++
  }

  return {
    numberOfGraphs,
    homeMapGraph,
    sdgWorkNodes,
    conceptWorkNodes,
    setHomeMapGraph,
    setSdgWorkNodes,
    setConceptWorkNodes,
    incrementNumberOfGraphs
  }
})
