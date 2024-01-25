<script setup>
import { ref } from "vue"
import { NGrid, NGridItem } from "naive-ui"
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
  <n-grid x-gap="12" y-gap="12" cols="1" responsive="screen">
    <n-grid-item>
      <div v-if="screenSize.isMobile">
        <TheSearch />
      </div>
    </n-grid-item>
    <n-grid-item>
      <div>
        <component :is="maps[currentMap]"></component>
      </div>
    </n-grid-item>
  </n-grid>
</template>
