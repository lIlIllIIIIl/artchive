import { createRouter, createWebHistory } from 'vue-router'

import ArtistPage from '@/pages/ArtistPage.vue'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  {path: '/', component: HomePage},
  {path: '/artist', component: ArtistPage}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
