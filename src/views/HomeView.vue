<script setup>
import { computed } from "vue"
import { NSpace, NGrid, NGridItem } from "naive-ui"
import TheSearch from "../components/TheSearch.vue"
import { useScreenSizeStore } from "../stores/screenSize.js"

const screenSize = useScreenSizeStore()
const topPadding = computed(() => (screenSize.isMobile ? "5vh 0 0 0" : "25vh 0 0 0"))
const logoSize = computed(() => (screenSize.isMobile ? "150px" : "250px"))
</script>

<template>
  <div :style="{ padding: topPadding }">
    <n-space justify="center">
      <n-grid x-gap="0" y-gap="0" cols="1" responsive="screen">
        <n-grid-item>
          <div>
            <img
              :style="{ width: logoSize }"
              src="../assets/images/kmapper_k.png"
              alt="The kmapper logo"
            />
          </div>
          <div class="tagline">...and some text?</div>
        </n-grid-item>
        <n-grid-item>
          <div>
            <TheSearch />
          </div>
        </n-grid-item>
      </n-grid>
    </n-space>
  </div>
</template>

<style scoped>
.tagline {
  margin-bottom: 5px;
}
</style>
