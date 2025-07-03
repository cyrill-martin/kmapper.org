<script setup>
import { h } from "vue"
import { NDataTable } from "naive-ui"
import { usePaperSpaceStore } from "../stores/paperSpace.js"
import { SDGs } from "../data/SDGs.js"

const paperSpace = usePaperSpaceStore()

const listDelimiter = " | "

function listSDGs(links) {
  return links
    .filter((link) => link.type === "sdg")
    .map((sdg) => `${sdg.id} - ${SDGs[sdg.id].name}`)
    .join(listDelimiter)
}

function listFields(links) {
  return links
    .filter((link) => link.type === "field")
    .map((field) => field.id)
    .join(listDelimiter)
}

const columns = [
  {
    type: "selection"
  },
  {
    type: "expand",
    // expandable: (row) => row.abstract,
    renderExpand: (row) => {
      return h("div", null, [
        h(
          "a",
          { href: row.doi, target: "_blank", style: { color: "#333447", textDecoration: "none" } },
          row.citation
        ),
        h("br"),
        h("br"),
        h("span", null, row.abstract ? "Abstract:" : "No abstract"),
        h("br"),
        h("span", null, row.abstract ? row.abstract : "")
      ])
    }
  },
  { title: "Title", key: "title" },
  { title: "Year", key: "year" },
  {
    title: "SDG",
    key: "sdg",
    render(row) {
      return listSDGs(row.links)
    }
  },
  {
    title: "Field",
    key: "field",
    render(row) {
      return listFields(row.links)
    }
  },
  { title: "Query", key: "query" }
]
</script>

<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="paperSpace.papers"
      :pagination="{ pageSize: 10 }"
      :row-key="(row) => row.openAlexId"
    />
  </div>
</template>
