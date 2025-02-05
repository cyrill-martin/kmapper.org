<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { NInputGroup, NInput, NIcon, NButton, NTooltip, NCollapse, NCollapseItem } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { PencilSharp, CheckmarkSharp } from "@vicons/ionicons5"

const search = useSearchStore()
const emit = defineEmits(["year-filter"])

onMounted(() => {
  yearString.value = search.publicationYear
})

watch(
  () => search.publicationYear,
  () => {
    yearString.value = search.publicationYear
  }
)

const editState = ref(false)
const yearString = ref(null)

const stateIcon = computed(() => {
  return editState.value ? CheckmarkSharp : PencilSharp
})

const stateButtonType = computed(() => {
  return editState.value ? "success" : "tertiary"
})

const collapseItemTitle = computed(() => {
  const baseTitle = "filter by publication year"
  return search.publicationYear ? `${baseTitle} ●` : baseTitle
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
  <n-collapse class="filter">
    <n-collapse-item :title="collapseItemTitle">
      <n-input-group class="year-filter">
        <span class="year-filter-label">year is</span>
        <n-input-group>
          <n-tooltip placement="bottom" trigger="click">
            <template #trigger>
              <n-input
                style="text-align: left"
                :size="'small'"
                :disabled="!editState"
                v-model:value="yearString"
                placeholder=""
                round
              ></n-input>
            </template>
            <span>e.g. 2023, &gt;2023, &lt;2023, 2020-2023</span>
          </n-tooltip>
          <n-button :size="'small'" secondary :type="stateButtonType" round @click="changeEditState"
            ><n-icon :component="stateIcon" />
          </n-button>
        </n-input-group>
      </n-input-group>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped>
.filter {
  margin: 0.5rem 0 0 2rem;
  flex: 1;
}
.year-filter {
  width: 210px;
  align-items: center;
}
.year-filter-label {
  min-width: 70px;
}
</style>
