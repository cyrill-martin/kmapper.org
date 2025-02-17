<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { NInputGroup, NInput, NIcon, NButton, NTooltip, NSelect } from "naive-ui"
import { useSearchStore } from "../stores/search.js"
import { CheckmarkSharp } from "@vicons/ionicons5"

const search = useSearchStore()
const emit = defineEmits(["filters"])

// Lifecycle
onMounted(() => {
  publicationYear.value = search.publicationYear
  oaStatus.value = search.oaStatus
})

// Watchers
watch(
  () => search.publicationYear,
  () => {
    publicationYear.value = search.publicationYear
  }
)

watch(
  () => search.oaStatus,
  () => {
    oaStatus.value = search.oaStatus
  }
)

// Editing
const editState = ref(false)

const stateButtonType = computed(() => {
  return editState.value ? "success" : "tertiary"
})

function changeEditState() {
  editState.value = !editState.value

  if (editState.value === false) {
    setPublicationYear()
    setOaStatus()
    emit("filters")
  }
}

// Year filter
const publicationYear = ref(null)

function setPublicationYear() {
  const currentYear = publicationYear.value ? publicationYear.value.replace(/\s+/g, "") : null
  search.setPublicationYear(currentYear ? currentYear : null)
}

// Open access filter
const oaStatus = ref(null)

const oaStatusOptions = [
  { label: "diamond", value: "diamond", disabled: true },
  { label: "gold", value: "gold" },
  { label: "green", value: "green" },
  { label: "hybrid", value: "hybrid" },
  { label: "bronze", value: "bronze" }
]

function setOaStatus() {
  console.log(oaStatus.value)
  search.setOaStatus(oaStatus.value)
}
</script>

<template>
  <div class="filter">
    <n-input-group class="filter-group">
      <span class="filter-label">publication year</span>
      <n-tooltip placement="bottom" trigger="click">
        <template #trigger>
          <n-input
            style="text-align: left"
            :disabled="!editState"
            v-model:value="publicationYear"
            placeholder=""
          ></n-input>
        </template>
        <span>e.g. 2023, &gt;2023, &lt;2023, 2020-2023</span>
      </n-tooltip>
    </n-input-group>
  </div>
  <div class="filter">
    <n-input-group class="filter-group">
      <span class="filter-label">open access status</span>
      <n-select
        v-model:value="oaStatus"
        :disabled="!editState"
        :options="oaStatusOptions"
        multiple
      />
    </n-input-group>
  </div>
  <div class="button-area">
    <n-button class="edit-button" secondary :type="stateButtonType" round @click="changeEditState">
      <n-icon v-if="editState" :component="CheckmarkSharp" />
      <span v-else>Edit</span>
    </n-button>
  </div>
</template>

<style scoped>
.filter {
  margin: 0.5rem 0 1.5rem 0;
}
.filter-group {
  align-items: center;
}
.filter-label {
  min-width: 180px;
  margin-right: 0.5rem;
}
.button-area {
  margin-top: 3rem;
  text-align: right;
}
</style>
