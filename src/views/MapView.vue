<script setup>
import { NFlex } from "naive-ui"
import { useScreenSizeStore } from "../stores/screenSize.js"
import TheSearch from "../components/TheSearch.vue"
import HomeMap from "../components/maps/HomeMap.vue"

const screenSize = useScreenSizeStore()
</script>

<template>
  <n-flex vertical class="map-view">
    <div v-if="screenSize.isMobile" class="map-search">
      <!-- Otherwise the search is shown in the header -->
      <TheSearch />
    </div>
    <div class="map-area">
      <HomeMap />
    </div>
  </n-flex>
</template>

<style>
.map-view {
  flex: 1;
}
.map-search {
  flex: 1;
}
.map-area {
  flex: 1;
}
</style>