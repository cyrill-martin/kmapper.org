<script setup>
import { NMessageProvider } from "naive-ui"
import { RouterView } from "vue-router"
import TheHeader from "./components/layout/TheHeader.vue"
import TheFooter from "./components/layout/TheFooter.vue"
</script>

<template>
  <n-message-provider>
    <TheHeader />

    <main>
      <RouterView />
    </main>

    <TheFooter />
  </n-message-provider>
</template>

<style scoped></style>
