<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { NFlex } from "naive-ui"
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
    <n-flex>
      <div class="logo-container">
        <RouterLink v-if="route.path !== '/'" to="/" @click="resetSearch">
          <img
            :style="{ width: logoSize }"
            src="../../assets/images/kmapper_k.png"
            alt="The kmapper logo"
          />
        </RouterLink>
      </div>
      <div v-if="showHeaderSearch" class="search-container">
        <TheSearch />
      </div>
      <div class="nav-container">
        <nav>
          <RouterLink to="/paperspace">Paper Space</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </n-flex>
  </header>
</template>

<style scoped>
header {
  padding: 1rem;
}
.logo-container {
  flex: 1;
}
.search-container {
  flex: 2;
  margin: 10px 10%;
}
.nav-container {
  display: flex;
  flex: 1;
  justify-content: end;
  align-items: baseline;
}
.nav-container nav a {
  margin: 0 0 0 15px;
}
</style>
