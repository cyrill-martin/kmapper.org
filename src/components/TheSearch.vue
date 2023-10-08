<script setup>
import { computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { NInputGroup, NInput, NButton, NIcon } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
// import { useMapsStore } from "../../stores/maps.js"

// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline"

// Use the router
const router = useRouter()
const route = useRoute()

// Use stores
const search = useSearchStore()
// const maps = useMapsStore()

const email = "mail@kmapper.com"

// Base function to search OpenAlex works
async function searchOpenAlexWorks(query, perPage, goldOpenAccessOnly) {
  query = encodeURIComponent(query)

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

// Function to search OpenAlex
async function searchContent() {
  try {

    // Search OpenAlex
    search.isLoading = true
    search.searchResults = await searchOpenAlexWorks(search.searchQuery, search.pageSize, search.goldOpenAccess)

    console.log("Search Results", search.searchResults)

    // Change route if not already on /map
    if (route.name !== "map") {
      router.push({ name: "map" })
    }

    search.isLoading = false

  } catch (error) {
    console.error("Request failed:", error.message)
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
