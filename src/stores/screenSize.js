import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useScreenSizeStore = defineStore("screenSize", () => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const ctrMarginV = computed(() => height.value * 0.8 * 0.01)
  const ctrMarginH = computed(() => width.value * 0.01)

  function updateScreenSize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  function debounce(func, delay) {
    let timerId
    return function (...args) {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  return { width, height, ctrMarginV, ctrMarginH, updateScreenSize, debounce }
})
