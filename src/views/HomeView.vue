<script setup>
import { computed } from "vue"
import { NFlex } from "naive-ui"
import TheSearch from "../components/TheSearch.vue"
import { useScreenSizeStore } from "../stores/screenSize.js"

const screenSize = useScreenSizeStore()
const logoSize = computed(() => (screenSize.isMobile ? "150px" : "250px"))
const bottomMargin = computed(() => (screenSize.isMobile ? "0 0 10px 0" : "0 0 25px 0"))
const desktopHome = computed(() => (screenSize.isMobile ? false : true))
const homeJustify = computed(() => (screenSize.isMobile ? "start" : "center"))
</script>

<template>
  <n-flex
    vertical
    :justify="homeJustify"
    :class="{ desktopHome: desktopHome, mobileHome: !desktopHome }"
  >
    <div>
      <img
        :style="{ width: logoSize }"
        src="../assets/images/kmapper_k.png"
        alt="The kmapper logo"
      />
    </div>
    <div :style="{ margin: bottomMargin }">
      Visualizing relevant Sustainable Development Goals and research fields of open access works
    </div>
    <div>
      <TheSearch />
    </div>
  </n-flex>
</template>

<style>
.desktopHome {
  flex: 1;
  margin: 0 30vw;
}
.mobileHome {
  flex: 1;
}
</style>
