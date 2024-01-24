<script setup>
import { onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { NSpace, NInputGroup, NInput, NButton, NIcon } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { useScreenSizeStore } from "../stores/screenSize.js"
// Icon
import SearchOutline from "@vicons/ionicons5/SearchOutline"

// Use the router
const route = useRoute()

// Use stores
const search = useSearchStore()
const screenSize = useScreenSizeStore()

// onMounted //////////////////
///////////////////////////////
onMounted(async () => {
  // Access query parameters
  const qParam = route.query.q

  if (qParam && !search.searchQuery) {
    search.setSearchQuery(qParam)
    await search.searchAndMapContent()
  }
})

const isValidSearch = computed(() => search.isValidSearchQuery)

const searchSize = computed(() => {
  if (route.path === "/") {
    return screenSize.isMobile ? "medium" : "large"
  } else {
    return screenSize.isMobile ? "small" : "medium"
  }
})
</script>

<template>
  <n-space justify="center">
    <n-input-group>
      <n-input
        round
        :size="searchSize"
        :style="{ width: '560px' }"
        autofocus
        v-model:loading="search.isLoading"
        placeholder="Search OpenAlex"
        v-model:value="search.searchQuery"
        @keyup.enter="isValidSearch && search.searchAndMapContent()"
      >
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
      </n-input>
      <n-button
        round
        :size="searchSize"
        type="primary"
        ghost
        @click="isValidSearch && search.searchAndMapContent()"
      >
        Search
      </n-button>
    </n-input-group>
  </n-space>
</template>
