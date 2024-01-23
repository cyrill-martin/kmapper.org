<script setup>
import { NSpace, NSpin, NPagination } from "naive-ui"
import { useSearchStore } from "../../stores/search.js"

// Use stores
const search = useSearchStore()

function triggerSearch(page) {
  search.setPage(page, search.searchAndMapContent)
}
</script>

<template>
  <n-space justify="center">
    <n-spin v-if="search.isLoading" size="5" />
  </n-space>
  <n-space justify="center">
    
    <n-pagination
      v-if="search.searchResults"
      v-model:page="search.paginatorPage"
      :page-count="search.resultsCount"
      @update:page="triggerSearch"
      size="small"
    />
  </n-space>
</template>
