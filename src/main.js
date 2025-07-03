import "./assets/css/main.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import { useScreenSizeStore } from "./stores/screenSize.js"
import { NConfigProvider, NMessageProvider, NDialogProvider, NFlex } from "naive-ui"

import "vfonts/FiraCode.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component("NConfigProvider", NConfigProvider)
app.component("NDialogProvider", NDialogProvider)
app.component("NMessageProvider", NMessageProvider)
app.component("NFlex", NFlex)

// Listen to screen size globally
const screenSize = useScreenSizeStore()
function updateScreenSize() {
  screenSize.updateScreenSize()
}
window.addEventListener("resize", updateScreenSize)

app.mount("#app")
