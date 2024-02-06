import { ref } from "vue"
import { defineStore } from "pinia"

export const useGraphStore = defineStore("graph", () => {
  // Graph state
  const numberOfGraphs = ref(0)

  const homeMapGraph = ref(null)
  const sdgWorkNodes = ref(null)
  const conceptWorkNodes = ref(null)

  const articleDetailsMapGraph = ref(null)
  const elementDetailsMapGraph = ref(null)

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

  function setDetailsMapGraph(type, data) {
    type === "works"
      ? (articleDetailsMapGraph.value = data)
      : (elementDetailsMapGraph.value = data)
  }

  return {
    numberOfGraphs,
    homeMapGraph,
    sdgWorkNodes,
    conceptWorkNodes,
    articleDetailsMapGraph,
    elementDetailsMapGraph,
    setHomeMapGraph,
    setSdgWorkNodes,
    setConceptWorkNodes,
    incrementNumberOfGraphs,
    setDetailsMapGraph
  }
})
