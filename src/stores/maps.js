import { ref } from "vue"
import { defineStore } from "pinia"

export const useMapsStore = defineStore("maps", () => {

  // Maps state
  const homeMapData = ref({})
  const sdgNodes = ref(null)
  const conceptNodes = ref(null)

  return { homeMapData, sdgNodes, conceptNodes }
})