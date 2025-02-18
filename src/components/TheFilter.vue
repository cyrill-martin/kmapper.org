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

const oaStatusOptions = ref([
  { label: "diamond", value: "diamond", disabled: false },
  { label: "gold", value: "gold", disabled: false },
  { label: "green", value: "green", disabled: false },
  { label: "hybrid", value: "hybrid", disabled: false },
  { label: "bronze", value: "bronze", disabled: false },
  { label: "closed", value: "closed", disabled: false }
])

function setOaStatus() {
  search.setOaStatus(oaStatus.value)
}

// Watchers
watch(
  () => oaStatus.value,
  (newValues) => {
    if (newValues.length === 1) {
      const option = oaStatusOptions.value.find((option) => option.value === newValues[0])
      option.disabled = true
    } else if (newValues.length > 1) {
      oaStatusOptions.value.forEach((option) => (option.disabled = false))
    }
  }
)

watch(
  () => search.publicationYear,
  (newValues) => {
    publicationYear.value = newValues
  }
)

watch(
  () => search.oaStatus,
  (newValues) => {
    oaStatus.value = newValues
  }
)
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
      <span class="filter-label"
        ><a
          href="https://docs.openalex.org/api-entities/works/work-object#oa_status"
          target="_blank"
          >open access status</a
        ></span
      >
      <n-select
        v-model:value="oaStatus"
        :disabled="!editState"
        :options="oaStatusOptions"
        multiple
        :fallback-option="true"
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
  align-items: center;
}
.button-area {
  margin-top: 3rem;
  text-align: right;
}
</style>
