import { SDGs } from "../data/SDGs.js"

export async function mapOpenAlexWorks(searchResults) {
  let uniqueSdgs = new Set()

  let uniqueConcepts = new Set()
  const conceptIRIs = {}

  const thresholds = {
    sdg: 0.25,
    concept: 0.75
  }

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

  // SDGs
  function getSdgs(work) {
    return work.sustainable_development_goals.length
      ? work.sustainable_development_goals
          .filter((sdg) => sdg.score > thresholds.sdg)
          .map((sdg) => {
            const sdgId = sdg.id.replace("https://metadata.un.org/sdg/", "")
            uniqueSdgs.add(parseInt(sdgId))
            return { type: "sdg", id: sdgId }
          })
      : null
  }

  // // Concepts
  // function getFirstConcept(concepts) {
  //   const firstConcept = concepts[0]

  //   return firstConcept
  //     ? (() => {
  //         uniqueConcepts.add(firstConcept.display_name)
  //         conceptIRIs[firstConcept.display_name] = firstConcept.wikidata
  //         return [{ type: "concept", id: firstConcept.display_name }]
  //       })()
  //     : null
  // }

  // function getConcepts(work) {
  //   const workConcepts = work.concepts.filter((concept) => concept.score > thresholds.concept)

  //   return workConcepts.length
  //     ? workConcepts.map((concept) => {
  //         uniqueConcepts.add(concept.display_name)
  //         conceptIRIs[concept.display_name] = concept.wikidata
  //         return { type: "concept", id: concept.display_name }
  //       })
  //     : getFirstConcept(work.concepts)
  // }

  // // domains
  // function getFirstConcept(topics) {
  //   const firstTopic = topics[0]

  //   return firstTopic
  //     ? (() => {
  //         uniqueConcepts.add(firstTopic.domain.display_name)
  //         conceptIRIs[firstTopic.domain.display_name] = firstTopic.id
  //         return [{ type: "concept", id: firstTopic.domain.display_name }]
  //       })()
  //     : null
  // }

  // function getConcepts(work) {
  //   const workTopics = work.topics.filter((topic) => topic.score > thresholds.concept)

  //   if (workTopics.length) {
  //     let uniqueDomains = new Set()
  //     workTopics.forEach((topic) => {
  //       // Handling the unique domains of THIS work
  //       uniqueDomains.add(topic.domain.display_name)

  //       // Handling the unique domains of ALL the works
  //       uniqueConcepts.add(topic.domain.display_name)
  //       conceptIRIs[topic.domain.display_name] = topic.id
  //     })
  //     return [...uniqueDomains].map((domain) => ({ type: "concept", id: domain }))
  //   } else {
  //     return getFirstConcept(work.topics)
  //   }
  // }

  // fields
  function getFirstConcept(topics) {
    const firstTopic = topics[0]

    return firstTopic
      ? (() => {
          uniqueConcepts.add(firstTopic.field.display_name)
          conceptIRIs[firstTopic.field.display_name] = firstTopic.id
          return [{ type: "concept", id: firstTopic.field.display_name }]
        })()
      : null
  }

  function getConcepts(work) {
    const workTopics = work.topics.filter((topic) => topic.score > thresholds.concept)

    if (workTopics.length) {
      let uniqueFields = new Set()
      workTopics.forEach((topic) => {
        // Handling the unique domains of THIS work
        uniqueFields.add(topic.field.display_name)

        // Handling the unique domains of ALL the works
        uniqueConcepts.add(topic.field.display_name)
        conceptIRIs[topic.domain.display_name] = topic.id
      })
      return [...uniqueFields].map((domain) => ({ type: "concept", id: domain }))
    } else {
      return getFirstConcept(work.topics)
    }
  }

  // SDG data
  function createGraphSDGs(uniqueSdgSet) {
    if (uniqueSdgSet.size !== 0) {
      return [...uniqueSdgSet]
        .sort((a, b) => a - b)
        .map((goal) => {
          return {
            id: goal,
            name: SDGs[goal].name,
            url: SDGs[goal].url,
            color: SDGs[goal].color
          }
        })
    }
  }

  // Concept data
  function createGraphConcepts(uniqueConceptSet) {
    return [...uniqueConceptSet].sort().map((concept) => {
      return {
        name: concept,
        url: conceptIRIs[concept]
      }
    })
  }

  // Related works
  function getRelatedWorks(work) {
    return work.related_works.length ? work.related_works : null
  }

  ////////////////////////////////////////////////////////////
  // MAPPING /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////

  // Filter out articles without a title and retracted articles
  const filteredResults = searchResults.results
    .filter((result) => result.title !== null)
    .filter((result) => result.is_retracted === false)

  const homeMapWorks = filteredResults.map((result, index) => {
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
    // SDGs
    const sdgs = getSdgs(result)
    // Concepts
    const concepts = getConcepts(result)
    // Links
    const links = [...(sdgs || []), ...(concepts || [])]
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
      links,
      relatedWorks
    }
  })

  // SDG data for the home graph
  const homeMapSDGs = createGraphSDGs(uniqueSdgs)
  // Concept data for the home graph
  const homeMapConcepts = createGraphConcepts(uniqueConcepts)

  return {
    sdgs: homeMapSDGs,
    concepts: homeMapConcepts,
    works: homeMapWorks
  }
}
