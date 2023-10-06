<script setup>
import { NGrid, NGridItem } from "naive-ui"
import TheSearch from "../components/TheSearch.vue"

</script>

<template>
  <n-grid x-gap="0" y-gap="0" cols="1" responsive="screen">
    <n-grid-item>
      <div>
        logo and some text?
      </div>
    </n-grid-item>
    <n-grid-item>
      <div>
        <TheSearch />
      </div>
    </n-grid-item>
  </n-grid>
</template>

<style scoped></style>
