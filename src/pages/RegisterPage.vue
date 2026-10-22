<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const userStore = useUserStore()
const emailInput = ref(null)
const form = reactive({ email: '', password: '', passwordConfirm: '' })
const errors = reactive({ email: '', password: '', passwordConfirm: '', common: '' })

onMounted(() => emailInput.value?.focus())

function clearErrors() {
  errors.email = ''
  errors.password = ''
  errors.passwordConfirm = ''
  errors.common = ''
}

function validate() {
  clearErrors()
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const cyrillicPattern = /[\u0400-\u04ff]/

  if (cyrillicPattern.test(form.email)) {
    errors.email = 'Email не должен содержать русские буквы.'
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Введите email латинскими буквами в формате name@example.com.'
  }

  if (cyrillicPattern.test(form.password)) {
    errors.password = 'Пароль не должен содержать русские буквы.'
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен содержать не менее 6 символов.'
  }
  if (form.passwordConfirm !== form.password) errors.passwordConfirm = 'Пароли не совпадают.'

  return !errors.email && !errors.password && !errors.passwordConfirm
}

async function submit() {
  if (!validate()) return

  const result = userStore.register(form.email, form.password)
  if (!result.ok) {
    errors[result.field ?? 'common'] = result.message
    await nextTick()
    if (result.field === 'email') emailInput.value?.focus()
    return
  }

  await router.push({ name: 'login', query: { registered: '1', email: form.email.trim() } })
}
</script>

<template>
  <div class="container container--narrow">
    <section class="auth-card" aria-labelledby="register-title">
      <p class="eyebrow">Новый профиль</p>
      <h1 id="register-title">Регистрация</h1>
      <p class="auth-card__lead">Создайте учебный аккаунт — задачи каждого пользователя хранятся отдельно.</p>

      <p v-if="errors.common" class="notice notice--error" role="alert">{{ errors.common }}</p>

      <form novalidate @submit.prevent="submit">
        <div class="form-group">
          <label for="register-email">Email</label>
          <input
            id="register-email"
            ref="emailInput"
            v-model.trim="form.email"
            class="form-group__input"
            type="email"
            autocomplete="username"
            required
            :aria-invalid="errors.email ? 'true' : undefined"
            :aria-describedby="errors.email ? 'register-email-error' : undefined"
            @input="errors.email = ''"
          >
          <span id="register-email-error" class="form-group__error" role="alert">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="register-password">Пароль</label>
          <input
            id="register-password"
            v-model="form.password"
            class="form-group__input"
            type="password"
            autocomplete="new-password"
            required
            :aria-invalid="errors.password ? 'true' : undefined"
            :aria-describedby="errors.password ? 'register-password-error' : undefined"
            @input="errors.password = ''"
          >
          <span id="register-password-error" class="form-group__error" role="alert">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="register-password-confirm">Повторите пароль</label>
          <input
            id="register-password-confirm"
            v-model="form.passwordConfirm"
            class="form-group__input"
            type="password"
            autocomplete="new-password"
            required
            :aria-invalid="errors.passwordConfirm ? 'true' : undefined"
            :aria-describedby="errors.passwordConfirm ? 'register-password-confirm-error' : undefined"
            @input="errors.passwordConfirm = ''"
          >
          <span id="register-password-confirm-error" class="form-group__error" role="alert">{{ errors.passwordConfirm }}</span>
        </div>

        <button class="button button--primary button--wide" type="submit">Создать аккаунт</button>
      </form>

      <p class="auth-card__footer">
        Уже зарегистрированы? <RouterLink to="/login">Войти</RouterLink>
      </p>
      <p class="auth-card__warning">
        Не используйте настоящий пароль: данные сохраняются только в localStorage браузера.
      </p>
    </section>
  </div>
</template>
