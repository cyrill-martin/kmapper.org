import { getDoiAndUrl } from "./getDoiAndUrl.js"
import { getAuthorNames } from "./getAuthorNames.js"

export function createDataByArticle(doajArticles) {
  const data = []

  doajArticles.forEach((article) => {
    const doiAndUrl = getDoiAndUrl(article)
    const authors = getAuthorNames(article)

    const articleObject = {
      doi: doiAndUrl.doi,
      url: doiAndUrl.url,
      title: article.bibjson.title,
      abstract: article.bibjson.abstract ? article.bibjson.abstract : "",
      journal: article.bibjson.journal.title,
      year: article.bibjson.year,
      authors: authors,
      kmapperSubjectId: article.kmapperSubjectId,
      kmapperSubject: article.kmapperSubject,
      kmapperColor: article.kmapperColor,
      doajRelevance: article.doajRelevance
    }

    data.push(articleObject)
  })

  return data
}
