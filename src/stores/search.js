import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useSearchStore = defineStore("search", () => {

  // State
  const searchQuery = ref(null)
  const pageSize = ref(50)
  const goldOpenAccess = ref(true)
  const isLoading = ref(false)
  const searchResults = ref(null)

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

  // Getters
  const hasSearchResults = computed(() => searchResults.value.results.length);

  const isValidSearchQuery = computed(() => searchQuery.value.trim().length !== 0)

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
    isValidSearchQuery
  }
})
