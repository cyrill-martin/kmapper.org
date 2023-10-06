<script setup>
import { computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { NInputGroup, NInput, NButton, NIcon } from "naive-ui"
import { useSearchStore } from "../../stores/search.js"
import { useMapsStore } from "../../stores/maps.js"

// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline"
// Functions
import { assignKmapperSubjects } from "../../utils/assignKmapperSubjects.js"
import { assignDoajRelevance } from "../../utils/assignDoajRelevance.js"
import { createDataByArticle } from "../../utils/createDataByArticle.js"

// Use the router
const router = useRouter()
const route = useRoute()

// Use stores
const searchStore = useSearchStore()
const mapsStore = useMapsStore()


// Check if it's a valid search
const isValidSearch = computed(() => {
  return searchStore.searchQuery.trim().length !== 0
})

// Function to dearch the DOAJ
async function search() {
  try {
    // Search Doaj
    searchStore.searchResults = await searchStore.searchDoaj(searchStore.searchQuery, searchStore.pageSize)

    console.log("Search Results", searchStore.searchResults)
    // Create map data
    assignKmapperSubjects(searchStore.searchResults.results)
    assignDoajRelevance(searchStore.searchResults.results)
    mapsStore.homeMapData = createDataByArticle(searchStore.searchResults.results)

    console.log("HomeMapData", mapsStore.homeMapData)

    // Change route if not already on /map
    if (route.name !== "map") {
      router.push({ name: "map" })
    }

  } catch (error) {
    console.error("Request failed:", error.message)
  }
};
</script>

<template>
  <n-input-group>
    <n-input round placeholder="Search..." v-model:value="searchStore.searchQuery" @keyup.enter="isValidSearch && search()">
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>
    <n-button round type="primary" ghost @click="isValidSearch && search()">
      Search
    </n-button>
  </n-input-group>
</template>
