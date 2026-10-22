import { createRouter, createWebHashHistory } from 'vue-router'
import AboutPage from '../pages/AboutPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import TodoPage from '../pages/TodoPage.vue'
import { useUserStore } from '../stores/user.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/about' },
    { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { guestOnly: true } },
    { path: '/todo', name: 'todo', component: TodoPage, meta: { requiresAuth: true } },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/:pathMatch(.*)*', redirect: '/about' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && userStore.isAuthenticated) return { name: 'todo' }
  return true
})

export default router
