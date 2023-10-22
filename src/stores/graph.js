import { ref } from "vue"
import { defineStore } from "pinia"

export const useGraphStore = defineStore("graph", () => {

  // Maps state
  const homeMapGraph = ref(null)
  const sdgWorkNodes = ref(null)
  const conceptWorkNodes = ref(null)

  return { homeMapGraph, sdgWorkNodes, conceptWorkNodes }
})