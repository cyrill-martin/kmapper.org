<script setup>
import { ref } from "vue"
import { NFlex } from "naive-ui"
import { useScreenSizeStore } from "../stores/screenSize.js"
import TheSearch from "../components/TheSearch.vue"
import HomeMap from "../components/maps/HomeMap.vue"
import DetailsMap from "../components/maps/DetailsMap.vue"

const screenSize = useScreenSizeStore()

const maps = {
  HomeMap,
  DetailsMap
}

const currentMap = ref("HomeMap")
</script>

<template>
  <n-flex vertical class="map-view">
    <div v-if="screenSize.isMobile" class="map-search">
      <!-- Otherwise the search is shown in the header -->
      <TheSearch />
    </div>
    <div class="map-area">
      <component :is="maps[currentMap]"></component>
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