import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { useScreenSizeStore } from "./screenSize.js"

export const useSearchStore = defineStore("search", () => {
  const screenSize = useScreenSizeStore()

  // State
  const searchQuery = ref(null)
  const pageSize = computed(() => screenSize.isMobile ? 18 : 36)
  const page = ref(1)
  const goldOpenAccess = ref(true)
  const isLoading = ref(false)
  const searchResults = ref(null)
  const hasSearchResults = computed(() => searchResults.value.results.length)
  const isValidSearchQuery = computed(() => searchQuery.value.trim().length !== 0)
  const politeMail = ref("mail@kmapper.com")

  const testData = ref(false)

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
    page,
    goldOpenAccess,
    isLoading,
    searchResults,
    setSearchQuery,
    toggleLoading,
    setSearchResults,
    hasSearchResults,
    isValidSearchQuery,
    politeMail,
    testData
  }
})
