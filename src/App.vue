<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import { useStoredTheme } from './composables/useStoredTheme.js'
import { useUserStore } from './stores/user.js'

const router = useRouter()
const userStore = useUserStore()
const { isDark } = useStoredTheme()
const userEmail = computed(() => userStore.currentUser?.email ?? '')

function toggleTheme() {
  isDark.value = !isDark.value
}

async function logout() {
  userStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <a class="skip-link" href="#main-content">Перейти к содержимому</a>

  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="app-header__brand" :to="userStore.isAuthenticated ? '/todo' : '/about'">
        TaskSpace
      </RouterLink>

      <nav class="app-nav" aria-label="Основная навигация">
        <RouterLink v-if="userStore.isAuthenticated" class="app-nav__link" to="/todo">Задачи</RouterLink>
        <RouterLink class="app-nav__link" to="/about">О приложении</RouterLink>
        <RouterLink v-if="!userStore.isAuthenticated" class="app-nav__link" to="/login">Вход</RouterLink>
        <RouterLink v-if="!userStore.isAuthenticated" class="app-nav__link" to="/register">Регистрация</RouterLink>
      </nav>

      <div class="app-header__actions">
        <span v-if="userEmail" class="app-header__user" :title="userEmail">{{ userEmail }}</span>
        <button v-if="userStore.isAuthenticated" type="button" class="button button--header" @click="logout">
          Выйти
        </button>
        <ThemeToggle :is-dark="isDark" @toggle="toggleTheme" />
      </div>
    </div>
  </header>

  <main id="main-content" class="app-main" tabindex="-1">
    <RouterView />
  </main>
</template>
