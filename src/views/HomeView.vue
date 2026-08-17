<script setup>
import { computed } from "vue"
import TheSearch from "../components/TheSearch.vue"
import { useScreenSizeStore } from "../stores/screenSize.js"

const screenSize = useScreenSizeStore()
const logoSize = computed(() => (screenSize.isMobile ? "150px" : "250px"))
const bottomMargin = computed(() => (screenSize.isMobile ? "0 0 10px 0" : "0 0 25px 0"))

const exampleQueries = [
  "urban sustainability",
  "astrobiology",
  "crypto rug pulls"
]
</script>

<template>
  <n-flex vertical class="homeContainer">
    <div>
      <img :style="{ width: logoSize }" src="../assets/images/kmapper_k.png" alt="The kmapper logo" />
    </div>
    <div>
      Visualizing relevant <a href="https://sdgs.un.org/goals" target="_blank">SDGs</a> and research
      fields of open access works
    </div>
    <div :style="{ margin: bottomMargin }">
      Example queries:
      <ul>
        <li v-for="(item, index) in exampleQueries" :key="index">
          <RouterLink :to="{ path: '/map', query: { q: item } }">
            {{ item }}
          </RouterLink>
        </li>
      </ul>
    </div>
    <div>
      <TheSearch />
    </div>
  </n-flex>
</template>

<style>
.homeContainer {
  flex: 1;
  margin: 0 30vw;
  padding-top: 15vh;
}

@media (max-width: 1000px) {
  .homeContainer {
    margin: 0 5vw;
    padding-top: 5vh;
  }
}
</style>
