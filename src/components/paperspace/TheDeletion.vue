<script setup>
import { NTooltip, NIcon, NButton } from "naive-ui"
import { usePaperSpaceStore } from "../../stores/paperSpace.js"
import { TrashOutline } from "@vicons/ionicons5"

const paperSpace = usePaperSpaceStore()

function handleDeletion() {
  paperSpace.removeMultiplePapers()
}
</script>

<template>
  <n-tooltip trigger="hover" placement="top">
    <template #trigger>
      <n-button strong secondary circle @click="handleDeletion">
        <template #icon>
          <n-icon><TrashOutline /></n-icon>
        </template>
      </n-button>
    </template>
    Delete
  </n-tooltip>
</template>
