// Function to assign customized kmapper subject area and color each article
// Iterating articles, getting all the available LCC classes, and mapping them to kmapper's own subject areas and colors

import { kmapperSubjects } from "./data/kmapperSubjects.js"
import { lccs } from "./data/lccs.js"
import { getLccCodes } from "./getLccCodes.js"
import { getArticleColor } from "./getArticleColor.js"

export function assignKmapperSubjects(doajArticles) {

  doajArticles.forEach((article) => {
    const lccCodes = getLccCodes(article)
    const kmapperIds = lccCodes
      ? lccCodes.map((code) => {
          if (code.length === 1) {
            return lccs[code].kmapperId
          }
          const first3 = code.slice(0, 3)
          if (first3 === "QA7") {
            return 28 // It's computer science
          }
          const reducedCode = first3.replace(/[^a-zA-Z]/g, "").replace("-", "")
          return lccs[reducedCode].kmapperId
        })
      : ["UK"]

    const uniqueKmapperIds = [...new Set(kmapperIds)].sort()

    // Add subject ids string
    article.kmapperSubjectId = uniqueKmapperIds.join("-");

    // Add actual subject strings
    const uniqueKmapperSubjecs = uniqueKmapperIds.map((id) => {
      return kmapperSubjects[id].label
    })

    article.kmapperSubject = uniqueKmapperSubjecs.join(" | ")

    // Add subject color(s)
    const articleColors = uniqueKmapperIds.map((id) => {
      return kmapperSubjects[id].color
    })

    const finalArticleColor = getArticleColor(articleColors)
    article.kmapperColor = finalArticleColor
  })
}
