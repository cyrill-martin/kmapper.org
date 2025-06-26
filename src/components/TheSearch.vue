<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { NInputGroup, NInput, NButton, NIcon, NModal } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { useScreenSizeStore } from "../stores/screenSize.js"
import { SearchOutline } from "@vicons/ionicons5"
import TheFilter from "./TheFilter.vue"

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
  const pyParam = route.query.py
  const oaParam = route.query.oa

  if (qParam && !search.searchQuery) {
    search.setSearchQuery(qParam)
    if (pyParam) {
      search.setPublicationYear(pyParam)
    }
    if (oaParam) {
      search.setOaStatus(splitOaParam(oaParam))
    }
    await search.searchAndMapContent()
  }
})

const isValidSearch = computed(() => search.isValidSearchQuery)

const showFilterModal = ref(false)

const searchSize = computed(() => {
  if (route.path === "/") {
    return screenSize.isMobile ? "medium" : "large"
  } else {
    return screenSize.isMobile ? "small" : "medium"
  }
})

function splitOaParam(param) {
  return param.split("|")
}
</script>

<template>
  <n-modal
    id="filter-modal"
    :style="{ width: screenSize.modalWidth }"
    v-model:show="showFilterModal"
    :mask-closable="true"
    preset="card"
    destroy-on-close
    ><TheFilter @filters="isValidSearch && search.searchAndMapContent()"
  /></n-modal>
  <n-input-group>
    <n-input
      :size="searchSize"
      round
      autofocus
      v-model:loading="search.isLoading"
      placeholder="Search OpenAlex for gold open access works"
      v-model:value="search.searchQuery"
      @keyup.enter="isValidSearch && search.searchAndMapContent()"
    >
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>
    <n-button
      :size="searchSize"
      round
      type="primary"
      ghost
      @click="isValidSearch && search.searchAndMapContent()"
    >
      Search
    </n-button>
  </n-input-group>
  <div class="filter-trigger" @click="showFilterModal = true">filters ●</div>
</template>

<style scoped>
.filter-trigger {
  margin: 0.5rem 0 0 2.35rem;
  cursor: pointer;
}
</style>
