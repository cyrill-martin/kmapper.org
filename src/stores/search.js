import { ref } from "vue"
import { defineStore } from "pinia"

export const useSearchStore = defineStore("search", () => {

  // State
  const searchQuery = ref("")
  const pageSize = ref(50)
  const searchResults = ref({})

  // Actions
  async function searchDoaj(query, size) {

    query = encodeURIComponent(query)
  
    try {
      const options = {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }
  
      const response = await fetch(`https://doaj.org/api/search/articles/${query}?pageSize=${size}`, options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`)
      }
  
      return await response.json()
  
    } catch (error) {
      console.error(error)
      throw error
    }
  };

  return { searchQuery, pageSize, searchDoaj, searchResults }
})
