<script setup>
import { NInput, NButton, NIcon, NTooltip, NFlex } from "naive-ui"
import { ref, onMounted } from "vue"
import { usePaperSpaceStore } from "../../stores/paperSpace.js"
import { SDGs } from "../../data/SDGs.js"
import { CopyOutline } from "@vicons/ionicons5"

const paperSpace = usePaperSpaceStore()

const prompt = ref(null)
const isLoading = ref(true)

const genericText = `You are an interdisciplinary researcher.

Below are some papers of interest.

Based on these papers, suggest:
- One or two interdisciplinary research questions
- A possible storyline or narrative that connects the themes
- Any surprising connections or unexplored intersections

---
`

onMounted(async () => {
  await generatePromptInput()
  isLoading.value = false
})

async function generatePromptInput() {
  const papersMetadata = await listCheckedPapersDate()
  prompt.value = `${genericText}
${papersMetadata}`
}

const listDelimiter = ", "

function listSDGs(links) {
  return links
    .filter((link) => link.type === "sdg")
    .map((sdg) => `${sdg.id} - ${SDGs[sdg.id].name}`)
    .join(listDelimiter)
}

function listFields(links) {
  return links
    .filter((link) => link.type === "field")
    .map((field) => field.id)
    .join(listDelimiter)
}

function createTextFormat(paper, index) {
  const sdgs = listSDGs(paper.links)
  const fields = listFields(paper.links)

  return `*Paper ${index + 1}*

Title: ${paper.title}
Year: ${paper.year}
Journal: ${paper.source.name}
URL: ${paper.url}
SDGs: ${sdgs.length > 1 ? sdgs : "-"}
Research fields: ${fields.length > 1 ? fields : "-"}
Abstract:
${paper.abstract}`
}

async function listCheckedPapersDate() {
  const relevantPapers = paperSpace.papers.filter((paper) => {
    return paperSpace.checkedPapers.includes(paper.openAlexId)
  })

  const paperArray = relevantPapers.map((paper, index) => {
    return createTextFormat(paper, index)
  })

  return paperArray.join(`

---

`)
}

async function handleCopying() {
  await navigator.clipboard.writeText(prompt.value)
}
</script>

<template>
  <n-flex>
    <div>
      <n-tooltip trigger="hover" placement="top">
        <template #trigger>
          <n-button strong secondary circle @click="handleCopying">
            <template #icon>
              <n-icon><CopyOutline /></n-icon>
            </template>
          </n-button>
        </template>
        Copy
      </n-tooltip>
    </div>
    <div>
      <n-input
        v-model:value="prompt"
        type="textarea"
        placeholder="..."
        :loading="isLoading"
        :autosize="{
          minRows: 5,
          maxRows: 25
        }"
      />
    </div>
  </n-flex>
</template>
