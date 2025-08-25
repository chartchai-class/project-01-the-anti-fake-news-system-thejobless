import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import NewsDetail from "../pages/NewsDetail.vue"
import VotePage from "../pages/VotePage.vue"

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/news/:id", name: "news-detail", component: NewsDetail, props: true },
  { path: "/news/:id/vote", name: "vote", component: VotePage, props: true },
]

export default createRouter({ history: createWebHistory(), routes })
