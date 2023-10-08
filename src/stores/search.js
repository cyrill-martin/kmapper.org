import { ref } from "vue"
import { defineStore } from "pinia"

export const useSearchStore = defineStore("search", () => {
  // State
  const searchQuery = ref("")
  const pageSize = ref(50)
  const goldOpenAccess = ref(true)
  const isLoading = ref(false)

  const searchResults = ref({})

  return { searchQuery, pageSize, goldOpenAccess, isLoading, searchResults }
})
