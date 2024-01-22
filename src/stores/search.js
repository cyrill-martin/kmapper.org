import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { useScreenSizeStore } from "./screenSize.js"
import { useGraphStore } from "../stores/graph.js"
import { useRouter, useRoute } from "vue-router"
import { mapOpenAlexWorks } from "../utils/mapOpenAlexWorks.js"
import { createSdgWorkNodes } from "../utils/createSdgWorkNodes.js"
import { createConceptWorkNodes } from "../utils/createConceptWorkNodes.js"
import { noSearchResults } from "../utils/messages.js"
import testDataMobile from "../data/testDataMobile.json"
import testDataDesktop from "../data/testDataDesktop.json"
import { useMessage } from "naive-ui"

export const useSearchStore = defineStore("search", () => {
  // Use the router
  const router = useRouter()
  const route = useRoute()

  // The message instance for this component. It will be sent to the
  // corresponding utils function
  const message = useMessage()

  const screenSize = useScreenSizeStore()
  const graph = useGraphStore()

  // Use of test data!!
  const testData = ref(false)

  // State
  const searchQuery = ref(null)
  const pageSize = computed(() => (screenSize.isMobile ? 18 : 36))
  const page = ref(1)
  const goldOpenAccess = ref(true)
  const isLoading = ref(false)
  const searchResults = ref(null)
  const hasSearchResults = computed(() => searchResults.value.results.length)
  const isValidSearchQuery = computed(() => searchQuery.value.trim().length !== 0)
  const politeMail = ref("mail@kmapper.com")

  // Actions

  // Base function to search OpenAlex works
  async function searchOpenAlexWorks(obj) {
    if (!testData.value) {
      const query = encodeURIComponent(obj.query)
      const perPage = obj.perPage
      const page = obj.page
      const goldOpenAccessOnly = obj.goldOpenAccessOnly
      const email = obj.email

      try {
        let url = `https://api.openalex.org/works?search=${query}&per-page=${perPage}&page=${page}`
        url = goldOpenAccessOnly ? `${url}&filter=open_access.oa_status:gold` : url
        url = url + `&mailto=${email}`

        console.log("GET", url)

        const options = {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        }

        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`)
        }
        return await response.json()
      } catch (error) {
        console.error(error)
        throw error
      }
    } else {
      return screenSize.isMobile ? testDataMobile : testDataDesktop
    }
  }

  // Function to to conduct user search and transform search results to kmapper data
  async function searchAndMapContent() {
    try {
      // Search OpenAlex
      toggleLoading() // Start loading indication

      searchResults.value = await searchOpenAlexWorks({
        query: searchQuery.value,
        perPage: pageSize.value,
        page: page.value,
        goldOpenAccessOnly: goldOpenAccess.value,
        email: politeMail.value
      })

      console.log("Search results", searchResults.value)

      if (hasSearchResults.value) {
        // Map OpenAlex results to kmapper home map
        const homeMapGraph = await mapOpenAlexWorks(searchResults.value)
        graph.setHomeMapGraph(homeMapGraph)
        console.log("Home graph", graph.homeMapGraph)

        // Create SDG-work nodes
        const sdgWorkNodes = await createSdgWorkNodes(graph.homeMapGraph)
        graph.setSdgWorkNodes(sdgWorkNodes)
        console.log("SDG-work nodes", graph.sdgWorkNodes)

        // Create concept-work nodes
        const conceptWorkNodes = await createConceptWorkNodes(graph.homeMapGraph)
        graph.setConceptWorkNodes(conceptWorkNodes)
        console.log("Concept-work nodes", graph.conceptWorkNodes)

        if (route.name !== "map") {
          // Change route if not already on /map
          router.push({
            name: "map",
            query: { q: searchQuery.value }
          })
        } else {
          // Else, update query parameter q
          router.replace({ query: { ...route.query, q: searchQuery.value } })
        }

        graph.incrementNumberOfGraphs()
        console.log("Number of graphs", graph.numberOfGraphs)
      } else {
        graph.setHomeMapGraph(null)
        graph.incrementNumberOfGraphs()
        noSearchResults(message, searchQuery.value)
      }

      toggleLoading() // End loading indication
    } catch (error) {
      console.error("Request failed:", error.message)
      toggleLoading() // End loading indication
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function toggleLoading() {
    isLoading.value = !isLoading.value
  }

  return {
    searchAndMapContent,
    searchQuery,
    pageSize,
    page,
    goldOpenAccess,
    isLoading,
    searchResults,
    setSearchQuery,
    toggleLoading,
    hasSearchResults,
    isValidSearchQuery,
    politeMail,
    testData
  }
})
