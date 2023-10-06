// Function to get the LCC classes and subclasses of an article
// The LCC classes are actually assigned to the article's journal by DOAJ

export function getLccCodes(doajArticle) {
  const { bibjson: { subject } = {} } = doajArticle
  
  if (!subject) return null

  const lccSubjectCodes = subject.filter(({ scheme }) => scheme === "LCC").map(({ code }) => code)
  
  return lccSubjectCodes.length ? lccSubjectCodes : null
}
