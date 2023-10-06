import { ref } from "vue"
import { defineStore } from "pinia"

export const useMapsStore = defineStore("maps", () => {

  // Maps state
  const homeMapData = ref({})
  const articleMapData = ref({})
  const subjectMapData = ref({})
  const relevanceMapData = ref({})

  return { homeMapData, articleMapData, subjectMapData, relevanceMapData }
})