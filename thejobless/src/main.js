import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import "./style.css"
import App from "./App.vue"
import { SpeedInsights } from "@vercel/speed-insights/vue"

if (import.meta.env.PROD) {
  injectSpeedInsights()
}

createApp(App).use(createPinia()).use(router).mount("#app")
