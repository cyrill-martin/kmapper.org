<script setup>
import {
  NConfigProvider,
  NMessageProvider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter
} from "naive-ui"
import { RouterView } from "vue-router"
import TheHeader from "./components/layout/TheHeader.vue"
import TheFooter from "./components/layout/TheFooter.vue"

const themeOverrides = {
  common: {
    primaryColor: "#333447",
    primaryColorPressed: "#333447",
    primaryColorHover: "#333447"
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div id="the-content-wrapper">
        <n-layout-header id="the-header">
          <TheHeader />
        </n-layout-header>
        <n-layout-content id="the-content">
          <main style="flex: 1; display: flex; flex-direction: column">
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
  height: 55px;
  padding: 1rem;
}
#the-content {
  flex: 1;
  padding: 1rem;
}
#the-footer {
  height: 80px;
  padding: 1rem;
}
</style>
