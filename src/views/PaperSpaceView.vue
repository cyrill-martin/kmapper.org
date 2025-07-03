<script setup>
import { onMounted } from "vue"
import { usePaperSpaceStore } from "../stores/paperSpace.js"
import { useDialog } from "naive-ui"
import { paperSpaceConsentDialog } from "../utils/paperSpaceConsent.js"
import ThePaperSpaceTable from "../components/ThePaperSpaceTable.vue"

const paperSpace = usePaperSpaceStore()
const dialog = useDialog()

onMounted(() => {
  console.log(paperSpace.papers)
  const consent = paperSpace.checkForConsent()
  if (!consent) {
    paperSpaceConsentDialog(dialog)
  }
})
</script>
<template>
  <n-flex vertical>
    <div>
      <h1>Paper Space</h1>
    </div>
    <div>
      <ThePaperSpaceTable />
    </div>
  </n-flex>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
}
</style>
