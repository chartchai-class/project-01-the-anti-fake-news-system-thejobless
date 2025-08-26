import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import "./style.css"
import App from "./App.vue"

import { inject as injectAnalytics } from "@vercel/analytics"
import { injectSpeedInsights } from "@vercel/speed-insights"

if (import.meta.env.PROD) {
  injectAnalytics()
  injectSpeedInsights()
}

createApp(App).use(createPinia()).use(router).mount("#app")
