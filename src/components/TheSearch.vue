<script setup>
import { onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { NInputGroup, NInput, NButton, NIcon } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline"

// Use the router
const route = useRoute()

// Use stores
const search = useSearchStore()

// onMounted //////////////////
///////////////////////////////
onMounted(async () => {
  console.log("TheSearch.vue is mounted!!")
  // Access query parameters
  const qParam = route.query.q

  if (qParam && !search.searchQuery) {
    search.setSearchQuery(qParam)
    await search.searchAndMapContent()
  }
})

// Check if it's a valid search (used in template)
const isValidSearch = computed(() => search.isValidSearchQuery)
</script>

<template>
  <n-input-group>
    <n-input
      round
      v-model:loading="search.isLoading"
      placeholder="Search..."
      v-model:value="search.searchQuery"
      @keyup.enter="isValidSearch && search.searchAndMapContent()"
    >
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>
    <n-button round type="primary" ghost @click="isValidSearch && search.searchAndMapContent()">
      Search
    </n-button>
  </n-input-group>
</template>
