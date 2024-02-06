<script setup>
import { onMounted, ref, computed } from "vue"
import ArticleDetailsMap from "./ArticleDetailsMap.vue"
import ElementDetailsMap from "./ElementDetailsMap.vue"
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"
// import { useScreenSizeStore } from "../../stores/screenSize.js"

// Use props
const props = defineProps(["inputObj"]) // E.g. {type: 'sdgs', parent: {...}}

// Use stores
// const screenSize = useScreenSizeStore()
const graph = useGraphStore()

// Data
const parentType = ref(props.inputObj.type)
const parentData = ref(props.inputObj.parent)
const parentChildren = ref(null)

onMounted(() => {

  console.log("parent", parentData.value)
  getFirstChildren(addSecondChildren)
  console.log("children", parentChildren.value)
})

function getFirstChildren(callback) {
  let children = []
  if (parentType.value === "works") {
    children = getArticleChildren(parentData.value.links)
  } else if (parentType.value === "sdgs") {
    children = getSdgChildren(parentData.value.id)
  } else {
    children = getConceptChildren(parentData.value.name)
  }
  parentChildren.value = children

  callback(createDetailsData) // callback is addSecondChildren()
}

function getArticleChildren(articleLinks) {
  const children = articleLinks.map((link) => {
    if (link.type === "sdg") {
      const sdg = graph.homeMapGraph.sdgs.find((sdg) => sdg.id.toString() === link.id)
      return { type: "sdg", data: sdg }
    } else {
      const concept = graph.homeMapGraph.concepts.find((concept) => concept.name === link.id)
      return { type: "concept", data: concept }
    }
  })
  return JSON.stringify(children)
}

function getSdgChildren(sdgId) {
  const children = graph.sdgWorkNodes[sdgId].works
    .filter((work) => work !== parentData.value.id) // filter out the parent work
    .map((work) => graph.homeMapGraph.works[work]) // map the remaining works to their nodes
  return JSON.stringify(children)
}

function getConceptChildren(conceptName) {
  const children = graph.conceptWorkNodes[conceptName].works
    .filter((work) => work !== parentData.value.id) // filter out the parent work)
    .map((work) => graph.homeMapGraph.works[work]) // map the remaining works to their nodes
  return JSON.stringify(children)
}

function addSecondChildren(callback) {

  const theParentChildren = JSON.parse(parentChildren.value)

  if (parentType.value === "works") {
    // First children are SDGs/concepts, each has works children
    theParentChildren.forEach((child) => {
      if (child.type === "sdg") {
        child.data.children = JSON.parse(getSdgChildren(child.data.id))
      } else {
        child.data.children = JSON.parse(getConceptChildren(child.data.name))
      }
    })
  } else {
    // First children are works, each has SDGs/concepts (in links!!)
    theParentChildren.forEach((child) => {
      child.children = JSON.parse(getArticleChildren(child.links))
    })
  }

  parentChildren.value = theParentChildren

  callback() // callback is createDetailsData()
}

function createDetailsData() {
  const detailsMapObject = {
    type: parentType.value,
    data: parentData.value,
    children: parentChildren.value
  }

  graph.setDetailsMapGraph(parentType.value, detailsMapObject)
}

const maps = {
  ArticleDetailsMap,
  ElementDetailsMap
}

const currentMap = computed(() => {
  return props.inputObj.type === "works" ? "ArticleDetailsMap" : "ElementDetailsMap"
})
</script>

<template>
  <div>
    <div>
      {{ parentData }}
    </div>
    <hr />
    <div>
      <component :is="maps[currentMap]"></component>
    </div>
  </div>
</template>
