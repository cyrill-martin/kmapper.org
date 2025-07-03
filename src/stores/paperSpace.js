import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { paperSpaceConsentDialog } from "../utils/paperSpaceConsent.js"

export const usePaperSpaceStore = defineStore("paperSpace", () => {
  const papers = ref(null)

  function checkForConsent() {
    return localStorage.getItem("paper-space-consent")
  }

  // Function to add a paper to the paper space
  function addToPaperSpace(dialogInstance, work) {
    if (checkForConsent()) {
      papers.value.push(work)
      saveInLocalStorage(papers.value)
    } else {
      paperSpaceConsentDialog(dialogInstance)
    }
  }

  function setPaperSpace(papersArray) {
    papers.value = papersArray
    saveInLocalStorage(papers.value)
  }

  // Function to remove paper from the paper space by OpenAlex ID
  function removeFromPaperSpace(openAlexId) {
    papers.value = papers.value.filter((paper) => paper.openAlexId !== openAlexId)
    saveInLocalStorage(papers.value)
  }

  // List of OpenAlex ID currently in the paper space
  const papersInSpace = computed(() => {
    if (papers.value.length) {
      return papers.value.map((paper) => paper.openAlexId)
    }
    return []
  })

  // Check if given OpenAlex ID is currently in the paper space
  function isPaperInSpace(id) {
    return papersInSpace.value.includes(id)
  }

  async function checkLocalStorage() {
    const papersString = localStorage.getItem("paper-space")

    if (papersString) {
      const parsedPaperString = loadFromLocalStorage(papersString)
      setPaperSpace(parsedPaperString)
    } else {
      setPaperSpace([])
    }
  }

  function saveInLocalStorage(papers) {
    localStorage.setItem("paper-space", JSON.stringify(papers))
  }

  function loadFromLocalStorage(papersString) {
    try {
      // Attempt to parse the data
      const parsedData = JSON.parse(papersString)

      // Optional: Ensure it's actually an array
      if (Array.isArray(parsedData)) {
        return parsedData
      } else {
        console.warn("Stored data for 'paperSpace' is not an array. Returning empty array.")
        return []
      }
    } catch (e) {
      console.error("Error parsing 'paperSpace' from localStorage:", e)
      localStorage.removeItem("paper-space")
      return []
    }
  }

  return {
    papers,
    papersInSpace,
    isPaperInSpace,
    addToPaperSpace,
    removeFromPaperSpace,
    checkLocalStorage,
    saveInLocalStorage,
    loadFromLocalStorage,
    setPaperSpace,
    checkForConsent
  }
})
