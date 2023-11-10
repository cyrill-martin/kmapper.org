import { h } from "vue"
import { NIcon } from "naive-ui"
import { SadOutline } from "@vicons/ionicons5"

export async function noSearchResults(messageInstance, query) {
  messageInstance.info(
    `The great OpenAlex was not able to find anything for your query '${query}'`,
    {
      icon: () => h(NIcon, null, { default: () => h(SadOutline) }),
      duration: 6000,
      closable: true
    }
  )
}
