<script setup>
import { ref, computed } from "vue"
import { NInputGroup, NInput, NIcon, NButton, NTooltip } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { PencilSharp, CheckmarkSharp } from "@vicons/ionicons5"

const emit = defineEmits(["year-filter"])

const search = useSearchStore()

const editState = ref(false)
const yearString = ref(null)

const stateIcon = computed(() => {
  return editState.value ? CheckmarkSharp : PencilSharp
})

function setPublicationYear() {
  const currentYear = yearString.value ? yearString.value.replace(/\s+/g, "") : null
  search.setPublicationYear(currentYear ? currentYear : null)
}

function changeEditState() {
  editState.value = !editState.value

  if (editState.value === false) {
    setPublicationYear()
    emit("year-filter")
  }
}
</script>

<template>
  <n-input-group class="year-filter">
    <span class="year-filter-label">year is</span>
    <n-input-group>
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <n-input
            style="text-align: left"
            :size="'tiny'"
            :disabled="!editState"
            v-model:value="yearString"
            placeholder=""
            round
          ></n-input>
        </template>
        <span>e.g. 2023, &gt;2023, &lt;2023, 2020-2023</span>
      </n-tooltip>
      <n-button :size="'tiny'" type="primary" round ghost @click="changeEditState"
        ><n-icon :component="stateIcon" />
      </n-button>
    </n-input-group>
  </n-input-group>
</template>

<style scoped>
.year-filter {
  margin: 0.5rem 0 0 0;
  width: 210px;
  align-items: center;
}
.year-filter-label {
  min-width: 70px;
}
</style>
