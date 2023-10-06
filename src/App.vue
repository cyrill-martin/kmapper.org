<script setup>
import { RouterView } from "vue-router"
import TheHeader from "./components/layout/TheHeader.vue"
import TheFooter from "./components/layout/TheFooter.vue"
</script>

<template>
  <div class="site-wrapper">
    <TheHeader />

    <main>
      <RouterView />
    </main>

    <TheFooter />
  </div>
</template>

<style scoped></style>
