export async function createConceptWorkNodes(homeMapGraph) {
  const conceptNodes = {}

  homeMapGraph.works.forEach((work) => {
    work.links.forEach((link) => {
      if (link.type === "concept") {
        if (!conceptNodes[link.id]) {
          conceptNodes[link.id] = { works: [] }
        }
        conceptNodes[link.id].works.push(work.id)
      }
    })
  })

  return conceptNodes
}
