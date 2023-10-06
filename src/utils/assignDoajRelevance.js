export function assignDoajRelevance(doajArticles) {
  const relevance = {
    0: "Most relevant",
    1: "Highly relevant",
    2: "Very relevant",
    3: "Relevant",
    4: "Generally relevant"
  }

  doajArticles.forEach((article, index) => {
    const relevanceLayer = Math.floor(index / 10)
    article.doajRelevance = relevance[relevanceLayer]
  })
}
