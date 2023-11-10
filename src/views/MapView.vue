<script setup>
import { ref } from "vue"
import { NGrid, NGridItem } from "naive-ui"
import TheSearch from "../components/TheSearch.vue"
import HomeMap from "../components/maps/HomeMap.vue"
import DetailsMap from "../components/maps/DetailsMap.vue"

const maps = {
  HomeMap,
  DetailsMap
}

const currentMap = ref("HomeMap")
</script>

<template>
  <n-grid x-gap="0" y-gap="0" cols="1" responsive="screen">
    <n-grid-item>
      <div>
        <TheSearch />
      </div>
    </n-grid-item>
    <n-grid-item>
      <div @click="currentMap = 'DetailsMap'">
        <transition name="slide">
          <component :is="maps[currentMap]"></component>
        </transition>
      </div>
    </n-grid-item>
  </n-grid>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
.slide-leave-from, .slide-enter-to {
  transform: translateX(-100%);
}
</style>