import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useScreenSizeStore = defineStore("screenSize", () => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const ctrMarginV = computed(() => height.value * 0.8 * 0.01)
  const ctrMarginH = computed(() => width.value * 0.01)
  const isMobile = computed(() => width.value < 1000)

  const modalWidth = computed(() => (isMobile.value ? "95%" : "90%"))

  function updateScreenSize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  return { width, height, ctrMarginV, ctrMarginH, isMobile, modalWidth, updateScreenSize }
})
