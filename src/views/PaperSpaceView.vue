<script setup>
import { onMounted } from "vue"
import { usePaperSpaceStore } from "../stores/paperSpace.js"
import { useDialog } from "naive-ui"
import { paperSpaceConsentDialog } from "../utils/paperSpaceConsent.js"
import TheTable from "../components/paperspace/TheTable.vue"

const paperSpace = usePaperSpaceStore()
const dialog = useDialog()

onMounted(() => {
  const consent = paperSpace.checkForConsent()
  if (!consent) {
    paperSpaceConsentDialog(dialog)
  }
})
</script>
<template>
  <div>
    <div>
      <h1>Paper Space</h1>
    </div>
    <div>
      <TheTable />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
}
</style>
