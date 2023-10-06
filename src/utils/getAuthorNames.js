export function getAuthorNames(doajArticle) {
  const authors = doajArticle.bibjson.author.map((obj) => {
    return obj.name
  })

  return authors
}
