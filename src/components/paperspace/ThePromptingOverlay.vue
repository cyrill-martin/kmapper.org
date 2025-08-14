<script setup>
import { NInput, NButton, NIcon, NTooltip, NFlex } from "naive-ui"
import { ref, onMounted } from "vue"
import { usePaperSpaceStore } from "../../stores/paperSpace.js"
import { SDGs } from "../../data/SDGs.js"
import { CopyOutline } from "@vicons/ionicons5"

const paperSpace = usePaperSpaceStore()

const prompt = ref(null)
const isLoading = ref(true)

const genericText = `You are an interdisciplinary researcher and narrative strategist.

Your goal is to transform academic research into compelling, cross-domain storylines.

Below is metadata for several papers, including titles, publication years, SDG relevance, and research fields. 

Tasks:
1. **Identify Core Themes** – Summarize the main topics and societal challenges represented.
2. **Connect Across Disciplines** – Show how the research fields and SDG targets might interact in novel ways.
3. **Generate Story Angles** – Suggest 2–3 potential interdisciplinary narratives, each with:
   - A catchy working title
   - A one-sentence hook for a general audience
   - The main conflict or tension in the story
4. **Highlight Gaps & Opportunities** – Point out surprising intersections, unexplored synergies, or contradictions that could inspire further research.

Output:
- Present as a concise, well-structured list.
- Avoid generic statements; be specific about how the elements connect.
- Keep a balance between accessibility and research depth.

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
