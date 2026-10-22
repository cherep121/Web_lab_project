<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const errorMessage = ref('')
const emailInput = ref(null)

const registrationComplete = route.query.registered === '1'

onMounted(() => emailInput.value?.focus())

async function submit() {
  errorMessage.value = ''
  const result = userStore.login(email.value, password.value)

  if (!result.ok) {
    errorMessage.value = result.message
    await nextTick()
    emailInput.value?.focus()
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/todo'
  await router.push(redirect)
}
</script>

<template>
  <div class="container container--narrow">
    <section class="auth-card" aria-labelledby="login-title">
      <p class="eyebrow">С возвращением</p>
      <h1 id="login-title">Вход в TaskSpace</h1>
      <p class="auth-card__lead">Войдите, чтобы открыть свой личный список задач.</p>

      <p v-if="registrationComplete" class="notice notice--success" role="status">
        Аккаунт создан. Теперь можно войти.
      </p>
      <p v-if="errorMessage" class="notice notice--error" role="alert">
        {{ errorMessage }}
      </p>

      <form novalidate @submit.prevent="submit">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input
            id="login-email"
            ref="emailInput"
            v-model.trim="email"
            class="form-group__input"
            type="email"
            autocomplete="username"
            required
            :aria-invalid="errorMessage ? 'true' : undefined"
            @input="errorMessage = ''"
          >
        </div>

        <div class="form-group">
          <label for="login-password">Пароль</label>
          <input
            id="login-password"
            v-model="password"
            class="form-group__input"
            type="password"
            autocomplete="current-password"
            required
            :aria-invalid="errorMessage ? 'true' : undefined"
            @input="errorMessage = ''"
          >
        </div>

        <button class="button button--primary button--wide" type="submit">Войти</button>
      </form>

      <p class="auth-card__footer">
        Ещё нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
      <p class="auth-card__warning">
        Это учебная авторизация. Используйте только вымышленные данные.
      </p>
    </section>
  </div>
</template>
