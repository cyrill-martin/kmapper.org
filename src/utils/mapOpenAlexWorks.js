import { SDGs } from "../data/SDGs.js"

export async function mapOpenAlexWorks(searchResults) {
  let uniqueSdgs = new Set()
  let uniqueFields = new Set()
  const fieldIRIs = {}

  const thresholds = {
    sdg: 0.25,
    field: 0.75
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

  // Fields
  function getFirstField(topics) {
    const firstField = topics[0]

    return firstField
      ? (() => {
          uniqueFields.add(firstField.field.display_name)
          fieldIRIs[firstField.field.display_name] = firstField.id
          return [{ type: "field", id: firstField.field.display_name }]
        })()
      : null
  }

  function getFields(work) {
    const workTopics = work.topics.filter((topic) => topic.score > thresholds.field)

    if (workTopics.length) {
      let theseUniqueFields = new Set()
      workTopics.forEach((topic) => {
        // Handling the unique domains of THIS work
        theseUniqueFields.add(topic.field.display_name)

        // Handling the unique domains of ALL the works
        uniqueFields.add(topic.field.display_name)
        fieldIRIs[topic.domain.display_name] = topic.id
      })
      return [...theseUniqueFields].map((domain) => ({ type: "field", id: domain }))
    } else {
      return getFirstField(work.topics)
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

  // Field data
  function createGraphFields(uniqueFieldsSet) {
    return [...uniqueFieldsSet].sort().map((field) => {
      return {
        name: field,
        url: fieldIRIs[field]
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
    // Fields
    const fields = getFields(result)
    // Links
    const links = [...(sdgs || []), ...(fields || [])]
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
  // Field data for the home graph
  const homeMapFields = createGraphFields(uniqueFields)

  return {
    sdgs: homeMapSDGs,
    fields: homeMapFields,
    works: homeMapWorks
  }
}
