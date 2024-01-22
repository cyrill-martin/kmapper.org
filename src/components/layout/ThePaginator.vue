<script setup>
import { ref, watch } from "vue"
import { NPagination } from "naive-ui"

const props = defineProps(["currentPage", "count"])
const page = ref(props.currentPage)

watch(
  () => page.value,
  () => {
    console.log(page.value)
  }
)
</script>

<template>
  <n-pagination v-model:page="page" :page-count="props.count" />
</template>
