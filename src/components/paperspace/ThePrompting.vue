<script setup>
import { ref } from "vue"
import { NTooltip, NIcon, NModal, NButton } from "naive-ui"
import { ReaderOutline } from "@vicons/ionicons5"
import ThePromptingOverlay from "./ThePromptingOverlay.vue"
import { useScreenSizeStore } from "../../stores/screenSize.js"

const screenSize = useScreenSizeStore()

const showPromptingModal = ref(false)

function handlePrompting() {
  showPromptingModal.value = !showPromptingModal.value
}
</script>

<template>
  <n-modal
    id="prompting-modal"
    :style="{ width: screenSize.modalWidth }"
    v-model:show="showPromptingModal"
    :mask-closable="true"
    preset="card"
    destroy-on-close
  >
    <ThePromptingOverlay v-if="showPromptingModal" />
  </n-modal>
  <n-tooltip trigger="hover" placement="top">
    <template #trigger>
      <n-button strong secondary circle @click="handlePrompting">
        <template #icon>
          <n-icon><ReaderOutline /></n-icon>
        </template>
      </n-button>
    </template>
    Generate prompt input
  </n-tooltip>
</template>
