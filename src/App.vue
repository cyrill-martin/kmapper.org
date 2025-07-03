<script setup>
import { onMounted } from "vue"
import { RouterView } from "vue-router"
import TheHeader from "./components/layout/TheHeader.vue"
import TheFooter from "./components/layout/TheFooter.vue"
import { usePaperSpaceStore } from "./stores/paperSpace.js"

const paperSpace = usePaperSpaceStore()

const themeOverrides = {
  common: {
    primaryColor: "#333447",
    primaryColorPressed: "#333447",
    primaryColorHover: "#333447",
    inputColor: "#f7f7f7",
    inputColorDisabled: "#f7f7f7",
    modalColor: "#f7f7f7",
    warningColor: "#333447"
  }
}

onMounted(async () => {
  await paperSpace.checkLocalStorage()
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <n-flex vertical class="flex-container">
          <TheHeader />
          <main>
            <RouterView />
          </main>
          <TheFooter />
        </n-flex>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>
.flex-container {
  min-height: 100vh;
  background-color: #f7f7f7;
}
main {
  display: flex;
  flex: 1;
  padding: 0 1rem 0 1rem;
}

.n-base-icon svg,
.n-icon svg {
  width: 100%;
  height: 100%;
}
</style>
