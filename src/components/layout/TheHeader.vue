<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { NSpace, NGrid, NGridItem } from "naive-ui"
import TheSearch from "../TheSearch.vue"
import { useSearchStore } from "../../stores/search.js"
import { useScreenSizeStore } from "../../stores/screenSize.js"

const route = useRoute()
const searchStore = useSearchStore()
const screenSize = useScreenSizeStore()

const logoSize = computed(() => (screenSize.isMobile ? "75px" : "110px"))

const showHeaderSearch = computed(() => {
  if (route.path === "/") {
    return false
  } else {
    return screenSize.isMobile ? false : true
  }
})

function resetSearch() {
  searchStore.searchQuery = ""
}
</script>

<template>
  <header style="height: 50px; padding: 1rem 1rem 0 1rem">
    <n-grid cols="3">
      <n-grid-item span="1">
        <RouterLink v-if="route.path !== '/'" to="/" @click="resetSearch">
          <img
            :style="{ width: logoSize }"
            src="../../assets/images/kmapper_k.png"
            alt="The kmapper logo"
          />
        </RouterLink>
      </n-grid-item>
      <n-grid-item span="1">
        <div v-if="showHeaderSearch">
          <TheSearch />
        </div>
      </n-grid-item>
      <n-grid-item span="1">
        <n-space justify="end">
          <nav>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </n-space>
      </n-grid-item>
    </n-grid>
  </header>
</template>
