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
    const authorships = work.authorships || []
    const authors = authorships.length
      ? authorships.map((authorObj) => ({
          name: authorObj.author.display_name,
          orcid: authorObj.author.orcid || null
        }))
      : null

    return authors
  }

  // SDGs
  function getSdgs(work) {
    const sustainable_development_goals = work.sustainable_development_goals || []

    return sustainable_development_goals.length
      ? sustainable_development_goals
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
    const firstTopic = topics[0]

    return firstTopic
      ? (() => {
          uniqueFields.add(firstTopic.field.display_name)
          fieldIRIs[firstTopic.field.display_name] = firstTopic.field.id
          return [{ type: "field", id: firstTopic.field.display_name }]
        })()
      : null
  }

  function getFields(work) {
    const topics = work.topics || []
    const workTopics = topics.filter((topic) => topic.score > thresholds.field)

    if (workTopics.length) {
      let theseUniqueFields = new Set()
      workTopics.forEach((topic) => {
        // Handling the unique fields of THIS work
        theseUniqueFields.add(topic.field.display_name)

        // Handling the unique fields of ALL the works
        uniqueFields.add(topic.field.display_name)
        fieldIRIs[topic.field.display_name] = topic.field.id
      })
      return [...theseUniqueFields].map((field) => ({ type: "field", id: field }))
    } else {
      return getFirstField(topics)
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
  // function getRelatedWorks(work) {
  //   return work.related_works.length ? work.related_works : null
  // }

  // Create abstract
  function getAbstract(work) {
    let abstract
    if (work.abstract_inverted_index) {
      abstract = []

      Object.entries(work.abstract_inverted_index).forEach(([key, value]) => {
        value.forEach((index) => {
          abstract[index] = key
        })
      })

      abstract = abstract.join(" ")
    } else {
      abstract = null
    }

    return abstract
  }

  function getCitation(work) {
    // e.g.: 2024: Miranda - https://doi.org/10.4000/miranda.60150
    const workYear = getYear(work)
    const workSource = getName(work)
    const doi = getDoi(work)

    let citation = workYear ? `${workYear}: ` : ""
    citation = workSource ? `${citation} ${workSource}` : citation
    citation = doi ? `${citation} - ${doi}` : citation

    return citation
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
    // Abstract
    const abstract = getAbstract(result)
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
    // const relatedWorks = getRelatedWorks(result)
    const citation = getCitation(result)

    return {
      id: index,
      openAlexId,
      doi,
      url,
      title,
      abstract,
      source: {
        type,
        name
      },
      year,
      authors,
      links,
      citation
      // relatedWorks
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
