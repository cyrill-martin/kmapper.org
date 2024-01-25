<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { NGrid, NGridItem, NSpace } from "naive-ui"
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
  <header>
    <n-grid cols="3" responsive="screen">
      <n-grid-item>
        <div>
          <RouterLink v-if="route.path !== '/'" to="/" @click="resetSearch">
            <img
              :style="{ width: logoSize }"
              src="../../assets/images/kmapper_k.png"
              alt="The kmapper logo"
            />
          </RouterLink>
        </div>
      </n-grid-item>
      <n-grid-item>
        <div v-if="showHeaderSearch">
          <TheSearch />
        </div>
      </n-grid-item>
      <n-grid-item>
        <div>
          <nav>
            <n-space justify="end">
              <RouterLink to="/about">About</RouterLink>
            </n-space>
          </nav>
        </div>
      </n-grid-item>
    </n-grid>
  </header>
</template>
