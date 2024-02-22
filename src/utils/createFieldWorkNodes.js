export async function createFieldWorkNodes(homeMapGraph) {
  const fieldNodes = {}

  homeMapGraph.works.forEach((work) => {
    work.links.forEach((link) => {
      if (link.type === "field") {
        if (!fieldNodes[link.id]) {
          fieldNodes[link.id] = { works: [] }
        }
        fieldNodes[link.id].works.push(work.id)
      }
    })
  })

  return fieldNodes
}
