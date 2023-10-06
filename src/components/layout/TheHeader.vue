<script setup>
import { RouterLink } from "vue-router"
import { NGrid, NGridItem, NSpace } from "naive-ui"
import { useSearchStore } from "../../stores/search.js"

const searchStore = useSearchStore()

function resetSearch() {
  searchStore.searchQuery = ""
};
</script>

<template>
  <header>
    <n-grid cols="2" responsive="screen">
      <n-grid-item>
        <div>
          <RouterLink v-if="$route.path !== '/'" to="/" @click="resetSearch">kmapper logo</RouterLink>
        </div>
      </n-grid-item>
      <n-grid-item>
        <div>
          <nav>
            <n-space justify="end">
              <RouterLink to="/about">About</RouterLink>
            </n-space>
          </nav>
        </div>
      </n-grid-item>
    </n-grid>
  </header>
</template>
