<script setup>
import { computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { NInputGroup, NInput, NButton, NIcon } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { useGraphStore } from "../stores/graph.js"
import { mapOpenAlexWorks } from "../utils/mapOpenAlexWorks.js"
import { createSdgWorkNodes } from "../utils/createSdgWorkNodes.js"
import { createConceptWorkNodes } from "../utils/createConceptWorkNodes.js"
import { politeMail } from "../data/politeMail.js"
// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline"

// Use the router
const router = useRouter()
const route = useRoute()

// Use stores
const search = useSearchStore()
const graph = useGraphStore()


// Base function to search OpenAlex works
async function searchOpenAlexWorks(obj) {

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
}

// Function to to conduct user search and transform search results to kmapper data
async function searchContent() {
  try {

    // Search OpenAlex
    search.isLoading = true // Start loading indication
    search.searchResults = await searchOpenAlexWorks(
      {
        query: search.searchQuery,
        perPage: search.pageSize,
        goldOpenAccessOnly: search.goldOpenAccess, 
        email: politeMail
      }
    )

    console.log("Search results", search.searchResults)

    // Map OpenAlex results to kmapper home map
    graph.homeMapGraph = await mapOpenAlexWorks(search.searchResults)
    console.log("Home graph", graph.homeMapGraph)

    // Create SDG-work nodes
    graph.sdgWorkNodes = await createSdgWorkNodes(graph.homeMapGraph)
    console.log("SDG-work nodes", graph.sdgWorkNodes)

    // Create concept-work nodes
    graph.conceptWorkNodes = await createConceptWorkNodes(graph.homeMapGraph)
    console.log("Concept-work nodes", graph.conceptWorkNodes)

    // Change route if not already on /map
    if (route.name !== "map") {
      router.push({ name: "map" })
    }

    search.isLoading = false // End loading indication

  } catch (error) {
    console.error("Request failed:", error.message)
    search.isLoading = false // End loading indication
  }
};

// Check if it's a valid search (used in template)
const isValidSearch = computed(() => {
  return search.searchQuery.trim().length !== 0
})
</script>

<template>
  <n-input-group>
    <n-input round v-model:loading="search.isLoading" placeholder="Search..." v-model:value="search.searchQuery"
      @keyup.enter="isValidSearch && searchContent()">
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>
    <n-button round type="primary" ghost @click="isValidSearch && searchContent()">
      Search
    </n-button>
  </n-input-group>
</template>
