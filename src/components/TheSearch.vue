<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { NInputGroup, NInput, NButton, NIcon } from "naive-ui";
import { useSearchStore } from "../stores/search.js";
// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline";

// Use the router
const router = useRouter()
const route = useRoute()

// Use search store
const searchStore = useSearchStore()


// Check if it's a valid search
const isValidSearch = computed(() => {
  return searchStore.searchQuery.trim().length !== 0
})

// Function to dearch the DOAJ
async function search() {
  try {
    searchStore.searchResults = await searchStore.searchDoaj(searchStore.searchQuery, searchStore.pageSize)

    console.log(searchStore.searchResults)

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
