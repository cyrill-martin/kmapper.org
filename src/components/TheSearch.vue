<script setup>
import { onMounted, computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { NInputGroup, NInput, NButton, NIcon, useMessage } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { useGraphStore } from "../stores/graph.js"
import { mapOpenAlexWorks } from "../utils/mapOpenAlexWorks.js"
import { createSdgWorkNodes } from "../utils/createSdgWorkNodes.js"
import { createConceptWorkNodes } from "../utils/createConceptWorkNodes.js"
import { noSearchResults } from "../utils/messages.js"
import { politeMail } from "../data/politeMail.js"
import testData25 from "../data/testData25.json"
import testData50 from "../data/testData50.json"
// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline"

// Use the router
const router = useRouter()
const route = useRoute()

// Use stores
const search = useSearchStore()
const graph = useGraphStore()

// The message instance for this component. It will be sent to the 
// corresponding utils function
const message = useMessage()

// onMounted //////////////////
///////////////////////////////
onMounted(async () => {
  console.log("TheSearch.vue is mounted!!")
  // Access query parameters
  const qParam = route.query.q;

  if (qParam && !search.searchQuery) {
    search.setSearchQuery(qParam)
    await searchAndMapContent()
  }
  console.log("Set the query", search.searchQuery)
});

const useTestData = 25 // false, 25, or 50

// Base function to search OpenAlex works
async function searchOpenAlexWorks(obj) {

  if (!useTestData) {
    const query = encodeURIComponent(obj.query)
    const perPage = obj.perPage
    const goldOpenAccessOnly = obj.goldOpenAccessOnly
    const email = obj.email

    try {
      let url = `https://api.openalex.org/works?search=${query}&per-page=${perPage}`
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
    return useTestData === 50 ? testData50 : testData25
  }
}

// Function to to conduct user search and transform search results to kmapper data
async function searchAndMapContent() {
  try {

    // Search OpenAlex
    search.toggleLoading() // Start loading indication

    const searchResults = await searchOpenAlexWorks(
      {
        query: search.searchQuery,
        perPage: search.pageSize,
        goldOpenAccessOnly: search.goldOpenAccess,
        email: politeMail
      }
    )
    search.setSearchResults(searchResults)
    console.log("Search results", search.searchResults)

    if (search.hasSearchResults) {

      // Map OpenAlex results to kmapper home map
      const homeMapGraph = await mapOpenAlexWorks(search.searchResults)
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

      // Change route if not already on /map
      if (route.name !== "map") {
        router.push({
          name: "map",
          query: { q: search.searchQuery }
        })
      }

      graph.incrementNumberOfGraphs()
      console.log("Number of graphs", graph.numberOfGraphs)

    } else {
      noSearchResults(message, search.searchQuery)
    }

    search.toggleLoading() // End loading indication

  } catch (error) {
    console.error("Request failed:", error.message)
    search.toggleLoading() // End loading indication
  }
};

// Check if it's a valid search (used in template)
const isValidSearch = computed(() => search.isValidSearchQuery)
</script>

<template>
  <n-input-group>
    <n-input round v-model:loading="search.isLoading" placeholder="Search..." v-model:value="search.searchQuery"
      @keyup.enter="isValidSearch && searchAndMapContent()">
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>
    <n-button round type="primary" ghost @click="isValidSearch && searchAndMapContent()">
      Search
    </n-button>
  </n-input-group>
</template>
