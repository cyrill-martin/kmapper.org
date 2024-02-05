<script setup>
import { onMounted, ref } from "vue"
// eslint-disable-next-line
import * as d3 from "d3"
import { useGraphStore } from "../../stores/graph.js"
// import { useScreenSizeStore } from "../../stores/screenSize.js"

// Use props
const props = defineProps(["obj"]) // E.g. {type: 'sdgs', index: '0'}

// Use stores
// const screenSize = useScreenSizeStore()
const graph = useGraphStore()

// Data
const parentType = ref(null)
const parentData = ref(null)
const detailsMapGraph = ref(null)

onMounted(() => {
  setPartent(props.obj)
  createDetailsData(props.obj, addSecondChildren)
})

function setPartent(obj) {
  parentType.value = obj.type
  parentData.value = graph.homeMapGraph[obj.type][obj.index]
}

function createDetailsData(obj, callback) {
  console.log(obj)

  detailsMapGraph.value = {
    type: obj.type,
    data: parentData.value,
    children: [...getFirstChildren(obj)]
  }

  callback(detailsMapGraph.value.children) // callback is addSecondChildren()

  console.log(detailsMapGraph.value)
}

function getFirstChildren(obj) {
  let children = []

  if (obj.type === "works") {
    children = getArticleChildren(parentData.value.links)
  } else if (obj.type === "sdgs") {
    children = getSdgChildren(parentData.value.id)
  } else {
    children = getConceptChildren(parentData.value.name)
  }

  return children
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
  return children
}

function getSdgChildren(sdgId) {
  const children = graph.sdgWorkNodes[sdgId].works
    .filter((work) => work !== parentData.value.id) // filter out the parent work
    .map((work) => graph.homeMapGraph.works[work]) // map the remaining works to their nodes
  return children
}

function getConceptChildren(conceptName) {
  const children = graph.conceptWorkNodes[conceptName].works
    .filter((work) => work !== parentData.value.id) // filter out the parent work)
    .map((work) => graph.homeMapGraph.works[work]) // map the remaining works to their nodes
  return children
}

function addSecondChildren(children) {
  if (parentType.value === "works") {
    // First children are SDGs/concepts, each has works children
    children.forEach((child) => {
      if (child.type === "sdg") {
        child.data.children = getSdgChildren(child.data.id)
      } else {
        child.data.children = getConceptChildren(child.data.name)
      }
    })
  } else {
    // First children are works, each has SDGs/concepts (in links!!)
    children.forEach((child) => {
      child.children = getArticleChildren(child.links)
    })
  }
}
</script>

<template>
  <div id="details-map"></div>
</template>
