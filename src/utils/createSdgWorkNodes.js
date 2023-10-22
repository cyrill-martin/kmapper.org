export async function createSdgWorkNodes(homeMapGraph) {
  const sdgNodes = {}

  homeMapGraph.works.forEach((work) => {
    work.links.forEach((link) => {
      if (link.type === "sdg") {
        if (!sdgNodes[link.id]) {
          sdgNodes[link.id] = { works: [] }
        }
        sdgNodes[link.id].works.push(work.id)
      }
    })
  })

  return sdgNodes
}
