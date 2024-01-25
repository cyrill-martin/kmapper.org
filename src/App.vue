<script setup>
import { computed } from "vue"
import {
  NConfigProvider,
  NMessageProvider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NFlex
} from "naive-ui"
import { RouterView } from "vue-router"
import TheHeader from "./components/layout/TheHeader.vue"
import TheFooter from "./components/layout/TheFooter.vue"
import { useScreenSizeStore } from "./stores/screenSize.js"


const screenSize = useScreenSizeStore()

const themeOverrides = {
  common: {
    primaryColor: "#333447",
    primaryColorPressed: "#333447",
    primaryColorHover: "#333447"
  }
}

const dynamicHeight = computed(() => (screenSize.isMobile ? "40px" : "55px"))
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div id="the-content-wrapper">
        <n-flex></n-flex>
        <n-layout-header id="the-header" :style="{ height: dynamicHeight }">
          <TheHeader />
        </n-layout-header>
        <n-layout-content id="the-content">
          <main>
            <RouterView />
          </main>
        </n-layout-content>
        <n-layout-footer id="the-footer">
          <TheFooter />
        </n-layout-footer>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
#the-content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
#the-header {
  padding: 1rem;
}
#the-content {
  flex: 1;
  padding: 0 1rem 0 1rem;
}
#the-footer {
  height: 80px;
  padding: 1rem;
  margin-top: 2rem;
}
</style>
