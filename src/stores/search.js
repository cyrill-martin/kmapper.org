import { ref, computed, watch } from "vue"
import { defineStore } from "pinia"
import { useScreenSizeStore } from "./screenSize.js"
import { useGraphStore } from "../stores/graph.js"
import { useRouter, useRoute } from "vue-router"
import { mapOpenAlexWorks } from "../utils/mapOpenAlexWorks.js"
import { createSdgWorkNodes } from "../utils/createSdgWorkNodes.js"
import { createFieldWorkNodes } from "../utils/createFieldWorkNodes.js"
import { noSearchResults } from "../utils/messages.js"

export const useSearchStore = defineStore("search", () => {
  // Use of test data!! ///////////////////////////////////
  /////////////////////////////////////////////////////////
  const testData = ref(false)
  const testDataMobile = ref(null)
  const testDataDesktop = ref(null)

  // Conditionally import test data
  if (import.meta.env.MODE === "development") {
    Promise.all([
      import("../data/testDataMobile.json"),
      import("../data/testDataDesktop.json")
    ]).then(([mobileTestData, desktopTestData]) => {
      testDataMobile.value = mobileTestData
      testDataDesktop.value = desktopTestData
    })
  }

  // Use the router
  const router = useRouter()
  const route = useRoute()

  const screenSize = useScreenSizeStore()
  const graph = useGraphStore()

  // State
  const searchQuery = ref(null)
  const isNewQuery = ref(true)
  const pageSize = computed(() => (screenSize.isMobile ? 18 : 36))
  const page = ref(1)
  const paginatorPage = ref(1)
  const isLoading = ref(false)
  const searchResults = ref(null)
  const resultsCount = computed(() => Math.ceil(searchResults.value.meta.count / pageSize.value))
  const hasSearchResults = computed(() => searchResults.value.results.length)
  const isValidSearchQuery = computed(
    () => searchQuery.value && searchQuery.value.trim().length !== 0
  )
  const politeMail = ref("mail@kmapper.com")

  const defaultPublicationYear = ref(null)
  const publicationYear = ref(defaultPublicationYear.value)

  const defaultOaStatus = ref(["diamond", "gold"])
  const oaStatus = ref(defaultOaStatus.value)

  const paperSpace = ref([])
  // paper: { query: "...", date: " ", sdgs: [], subjects: [], title: "..."}

  watch(
    () => searchQuery.value,
    () => {
      page.value = 1
    }
  )

  // Actions

  // Filter
  function setPublicationYear(value) {
    publicationYear.value = value
  }

  function setOaStatus(value) {
    oaStatus.value = value
  }

  // Base function to search OpenAlex works
  async function searchOpenAlexWorks(obj) {
    if (!testData.value) {
      const query = encodeURIComponent(obj.query)
      const perPage = obj.perPage
      const page = obj.page
      const publicationYear = obj.publicationYear
      const oaStatus = obj.oaStatus
      const email = obj.email

      try {
        let url = `https://api.openalex.org/works?search=${query}&per-page=${perPage}&page=${page}`
        url = `${url}&filter=open_access.oa_status:${oaStatus}`
        url = publicationYear ? `${url},publication_year:${publicationYear}` : url
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
      return screenSize.isMobile ? testDataMobile.value : testDataDesktop.value
    }
  }

  // Function to to conduct user search and transform search results to kmapper data
  async function searchAndMapContent(messageInstance) {
    try {
      // Search OpenAlex
      toggleLoading() // Start loading indication

      searchResults.value = await searchOpenAlexWorks({
        query: searchQuery.value,
        perPage: pageSize.value,
        page: page.value,
        oaStatus: oaStatus.value.join("|"),
        publicationYear: publicationYear.value,
        email: politeMail.value
      })

      // console.log("Search results", searchResults.value)

      if (hasSearchResults.value) {
        // Map OpenAlex results to kmapper home map
        const homeMapGraph = await mapOpenAlexWorks(searchResults.value)

        // console.log(homeMapGraph)

        graph.setHomeMapGraph(homeMapGraph)
        // console.log("Home graph", graph.homeMapGraph)

        // Create SDG-work nodes
        const sdgWorkNodes = await createSdgWorkNodes(graph.homeMapGraph)
        graph.setSdgWorkNodes(sdgWorkNodes)
        // console.log("SDG-work nodes", graph.sdgWorkNodes)

        // Create field-work nodes
        const fieldWorkNodes = await createFieldWorkNodes(graph.homeMapGraph)
        graph.setFieldWorkNodes(fieldWorkNodes)
        // console.log("Field-work nodes", graph.fieldWorkNodes)

        const query =
          route.name !== "map" ? { q: searchQuery.value } : { ...route.query, q: searchQuery.value }

        if (publicationYear.value) {
          query.py = publicationYear.value
        } else if (route.query.py) {
          delete query.py
        }

        if (oaStatus.value) {
          query.oa = oaStatus.value.join("|")
        } else if (route.query.oa) {
          delete query.oa
        }

        if (route.name !== "map") {
          router.push({
            name: "map",
            query: query
          })
        } else {
          router.replace({ query: query })
        }

        graph.incrementNumberOfGraphs()
      } else {
        graph.setHomeMapGraph(null)
        graph.incrementNumberOfGraphs()
        noSearchResults(messageInstance, searchQuery.value)
      }

      toggleLoading() // End loading indication
      paginatorPage.value = page.value
    } catch (error) {
      console.error("Request failed:", error.message)
      toggleLoading() // End loading indication
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setPage(receivedPage, callback) {
    page.value = receivedPage
    callback()
  }

  function toggleLoading() {
    isLoading.value = !isLoading.value
  }

  function addToPaperSpace(paper) {
    paperSpace.value.push(paper)
  }

  return {
    searchAndMapContent,
    searchQuery,
    isNewQuery,
    pageSize,
    page,
    paginatorPage,
    isLoading,
    searchResults,
    resultsCount,
    setSearchQuery,
    setPage,
    toggleLoading,
    hasSearchResults,
    isValidSearchQuery,
    politeMail,
    testData,
    publicationYear,
    setPublicationYear,
    oaStatus,
    setOaStatus,
    addToPaperSpace
  }
})
