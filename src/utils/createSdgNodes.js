export async function createSdgNodes(homeMapData) {

  const sdgNodes = {}

  homeMapData.works.forEach((work) => {
    work.sdgs.forEach((sdgId) => {
      if (!sdgNodes[sdgId]) {
        sdgNodes[sdgId] = []
      }
      sdgNodes[sdgId].push(work.id)
    })
  })

  return sdgNodes
}