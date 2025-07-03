export async function noSearchResults(messageInstance, query) {
  messageInstance.info(`OpenAlex.org was not able to find anything for your query '${query}'`, {
    icon: () => null,
    duration: 6000,
    closable: true
  })
}
