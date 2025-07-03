import { h } from "vue"
import ThePaperSpaceConsentContent from "../components/ThePaperSpaceConsentContent.vue"

export async function paperSpaceConsentDialog(dialogInstance) {
  dialogInstance.warning({
    title: "Paper Space ",
    content: () => h(ThePaperSpaceConsentContent),
    positiveText: "Accept",
    negativeText: "Decline",
    // icon: () => h(NIcon, { size: "88" }, { default: () => h(NewspaperOutline) }),
    draggable: false,
    onPositiveClick: () => {
      localStorage.setItem("paper-space-consent", true)
    }
  })
}
