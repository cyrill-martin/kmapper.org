import { theSDGs } from "../data/theSDGs.js"
import { theThresholds } from "../data/theThresholds.js"

export async function mapOpenAlexWorks(searchResults) {
  let uniqueConcepts = new Set()
  const conceptIRIs = {}

  let uniqueSdgs = new Set()

  // openAlexId
  function getOpenAlexId(work) {
    return work.id
  }

  // DOI
  function getDoi(work) {
    return work.doi ? work.doi : null
  }

  // Landing page URL
  function getLandingPageUrl(work) {
    return work.primary_location && work.primary_location.landing_page_url
      ? work.primary_location.landing_page_url
      : null
  }

  // Title
  function getTitle(work) {
    return work.title ? work.title : null
  }

  // Source type
  function getType(work) {
    return work.primary_location &&
      work.primary_location.source &&
      work.primary_location.source.type
      ? work.primary_location.source.type
      : null
  }

  // Source name
  function getName(work) {
    return work.primary_location &&
      work.primary_location.source &&
      work.primary_location.source.display_name
      ? work.primary_location.source.display_name
      : null
  }

  // Year
  function getYear(work) {
    return work.publication_year ? work.publication_year : null
  }

  // Authors
  function getAuthors(work) {
    const authors = work.authorships.length
      ? work.authorships.map((authorObj) => ({
          name: authorObj.author.display_name,
          orcid: authorObj.author.orcid || null
        }))
      : null

    return authors
  }

  // Concepts
  function getFirstConcept(concepts) {
    const firstConcept = concepts[0]

    return firstConcept
      ? (() => {
          uniqueConcepts.add(firstConcept.display_name)
          conceptIRIs[firstConcept.display_name] = firstConcept.wikidata
          return [firstConcept.display_name]
        })()
      : null
  }

  function getConcepts(work) {
    const workConcepts = work.concepts.filter((concept) => concept.score > theThresholds.concept)

    const concepts = workConcepts.length
      ? workConcepts.map((concept) => {
          uniqueConcepts.add(concept.display_name)
          conceptIRIs[concept.display_name] = concept.wikidata
          return concept.display_name
        })
      : getFirstConcept(work.concepts)

    return concepts
  }

  // SDGs
  function getSdgs(work) {
    const sdgs = work.sustainable_development_goals.length
      ? work.sustainable_development_goals
          .filter((sdg) => sdg.score > theThresholds.sdg)
          .map((sdg) => {
            const sdgId = sdg.id.replace("https://metadata.un.org/sdg/", "")
            uniqueSdgs.add(parseInt(sdgId))
            return sdgId
          })
      : null

    return sdgs
  }

  // Related works
  function getRelatedWorks(work) {
    return work.related_works.length ? work.related_works : null
  }

  // SDG data
  function createSdgData(uniqueSdgSet) {
    return [...uniqueSdgSet]
      .sort((a, b) => a - b)
      .map((goal) => {
        return {
          id: goal,
          name: theSDGs[goal].name,
          url: theSDGs[goal].url,
          color: theSDGs[goal].color
        }
      })
  }

  // Concept data
  function createConceptData(uniqueConceptSet) {
    return [...uniqueConceptSet].sort().map((concept) => {
      return {
        name: concept,
        url: conceptIRIs[concept]
      }
    })
  }

  ////////////////////////////////////////////////////////////
  // MAPPING /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  const homeMapWorks = searchResults.results.map((result, index) => {
    // openAlexId
    const openAlexId = getOpenAlexId(result)
    // DOI
    const doi = getDoi(result)
    // Landing page URL
    let landingPageUrl = null
    if (!doi) {
      const landingPage = getLandingPageUrl(result)
      landingPageUrl = landingPage ? landingPage : null
    }
    // URL
    const url = doi ? doi : landingPageUrl
    // Title
    const title = getTitle(result)
    // Create plaintext abstract based on OpenAlex data ???
    // Source type
    const type = getType(result)
    // Source name
    const name = getName(result)
    // Year
    const year = getYear(result)
    // Authors
    const authors = getAuthors(result)
    // Concepts
    const concepts = getConcepts(result)
    // SDGs
    const sdgs = getSdgs(result)
    // Related works
    const relatedWorks = getRelatedWorks(result)

    return {
      id: index,
      openAlexId,
      doi,
      url,
      title,
      source: {
        type,
        name
      },
      year,
      authors,
      concepts,
      sdgs,
      relatedWorks
    }
  })

  // SDG data for the home map
  const sdgData = createSdgData(uniqueSdgs)
  // Concept data for the home map
  const conceptData = createConceptData(uniqueConcepts)

  return {
    sdgs: sdgData,
    concepts: conceptData,
    works: homeMapWorks
  }
}
