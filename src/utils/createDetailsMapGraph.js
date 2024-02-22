import { ref } from "vue"
import { useGraphStore } from "../stores/graph.js"

export async function createDetailsMapGraph(inputObj) {
  // Use stores
  const graph = useGraphStore()

  function getFirstChildren(callback) {
    let children = []
    if (rootType === "works") {
      children = getArticleChildren(rootData.links)
    } else if (rootType === "sdgs") {
      children = getSdgChildren(rootData.id)
    } else {
      children = getFieldChildren(rootData.name)
    }
    rootChildren.value = children

    callback() // callback is addSecondChildren()
  }

  function getArticleChildren(articleLinks) {
    const children = articleLinks
      .filter((link) => {
        if (rootType === "sdgs") {
          return link.id !== rootData.id.toString()
        } else {
          return link.id !== rootData.name
        }
      })
      .map((link) => {
        if (link.type === "sdg") {
          const sdg = graph.homeMapGraph.sdgs.find((sdg) => sdg.id.toString() === link.id)
          return { type: "sdg", data: sdg }
        } else {
          const field = graph.homeMapGraph.fields.find((field) => field.name === link.id)
          return { type: "field", data: field }
        }
      })
    return JSON.stringify(children)
  }

  function getSdgChildren(sdgId) {
    const children = graph.sdgWorkNodes[sdgId].works
      .filter((work) => work !== rootData.id) // filter out the parent work
      .map((work) => graph.homeMapGraph.works[work]) // map the remaining works to their nodes
    return JSON.stringify(children)
  }

  function getFieldChildren(fieldName) {
    const children = graph.fieldWorkNodes[fieldName].works
      .filter((work) => work !== rootData.id) // filter out the parent work)
      .map((work) => graph.homeMapGraph.works[work]) // map the remaining works to their nodes
    return JSON.stringify(children)
  }

  function addSecondChildren() {
    const therootChildren = JSON.parse(rootChildren.value)
    if (rootType === "works") {
      // First children are SDGs/fields, each has works children
      therootChildren.forEach((child) => {
        if (child.type === "sdg") {
          child.data.children = JSON.parse(getSdgChildren(child.data.id))
        } else {
          child.data.children = JSON.parse(getFieldChildren(child.data.name))
        }
      })
    } else {
      // First children are works, each has SDGs/fields (in links!!)
      therootChildren.forEach((child) => {
        child.children = JSON.parse(getArticleChildren(child.links))
      })
    }
    
    rootChildren.value = therootChildren
  }

  function createDetailsData() {
    const detailsMapObject = {
      type: rootType,
      data: rootData,
      children: rootChildren.value
    }
    return detailsMapObject
  }

  const rootType = inputObj.type
  const rootData = inputObj.root
  const rootChildren = ref(null)

  getFirstChildren(addSecondChildren)
  const detailsData = createDetailsData()

  return detailsData
}
