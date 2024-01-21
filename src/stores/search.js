import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { useScreenSizeStore } from "./screenSize.js"

export const useSearchStore = defineStore("search", () => {
  const screenSize = useScreenSizeStore()

  // State
  const searchQuery = ref(null)
  const pageSize = computed(() => screenSize.isMobile ? 18 : 36)
  const goldOpenAccess = ref(true)
  const isLoading = ref(false)
  const searchResults = ref(null)
  const hasSearchResults = computed(() => searchResults.value.results.length)
  const isValidSearchQuery = computed(() => searchQuery.value.trim().length !== 0)

  const testData = ref(true)

  // Actions
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function toggleLoading() {
    isLoading.value = !isLoading.value
  }

  function setSearchResults(data) {
    searchResults.value = data
  }

  return {
    searchQuery,
    pageSize,
    goldOpenAccess,
    isLoading,
    searchResults,
    setSearchQuery,
    toggleLoading,
    setSearchResults,
    hasSearchResults,
    isValidSearchQuery,
    testData
  }
})
