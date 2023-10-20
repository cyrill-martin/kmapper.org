export async function createConceptNodes(homeMapData) {

  const conceptNodes = {}

  homeMapData.works.forEach((work) => {
    work.concepts.forEach((concept) => {
      if (!conceptNodes[concept]) {
        conceptNodes[concept] = []
      }
      conceptNodes[concept].push(work.id)
    })
  })

  return conceptNodes
}