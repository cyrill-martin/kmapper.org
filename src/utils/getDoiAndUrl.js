export function getDoiAndUrl(doajArticle) {
  const { bibjson: { identifier, link } } = doajArticle;

  // Get the identifier object with the DOI
  const doiObj = identifier.find((obj) => obj.type.toLowerCase() === "doi");
  const doi = doiObj ? doiObj.id : null

  let cleanArticleUrl = ""

  if (!doi && link && link[0] && link[0].url) {
    cleanArticleUrl = link[0].url.replace(/\s+/g, '').trim();
  }

  const url = doi ? `https://doi.org/${doi}` : cleanArticleUrl

  return {
    doi: doi,
    url: url,
  }
}
