import { defineStore } from 'pinia'

const CYRILLIC_PATTERN = /[\u0400-\u04ff]/
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

function createId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function normalizeEmail(email) {
  return email.trim().toLocaleLowerCase('en-US')
}

export const useUserStore = defineStore('users', {
  state: () => ({ users: [], currentUserId: null }),

  getters: {
    currentUser: (state) => state.users.find((user) => user.id === state.currentUserId) ?? null,
    isAuthenticated() {
      return this.currentUser !== null
    }
  },

  actions: {
    register(email, password) {
      const normalizedEmail = normalizeEmail(email)

      if (CYRILLIC_PATTERN.test(normalizedEmail)) {
        return { ok: false, field: 'email', message: 'Email не должен содержать русские буквы.' }
      }
      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        return { ok: false, field: 'email', message: 'Введите email латинскими буквами в формате name@example.com.' }
      }
      if (CYRILLIC_PATTERN.test(password)) {
        return { ok: false, field: 'password', message: 'Пароль не должен содержать русские буквы.' }
      }
      if (password.length < 6) {
        return { ok: false, field: 'password', message: 'Пароль должен содержать не менее 6 символов.' }
      }

      if (this.users.some((user) => user.email === normalizedEmail)) {
        return { ok: false, field: 'email', message: 'Пользователь с таким email уже зарегистрирован.' }
      }

      this.users.push({ id: createId('user'), email: normalizedEmail, password })
      return { ok: true }
    },

    login(email, password) {
      const normalizedEmail = normalizeEmail(email)

      if (CYRILLIC_PATTERN.test(normalizedEmail)) {
        return { ok: false, message: 'Email не должен содержать русские буквы.' }
      }
      if (CYRILLIC_PATTERN.test(password)) {
        return { ok: false, message: 'Пароль не должен содержать русские буквы.' }
      }

      const user = this.users.find((item) => item.email === normalizedEmail && item.password === password)
      if (!user) return { ok: false, message: 'Неверный email или пароль.' }

      this.currentUserId = user.id
      return { ok: true }
    },

    logout() {
      this.currentUserId = null
    }
  },

  persist: {
    key: 'taskspace.users',
    pick: ['users', 'currentUserId']
  }
})
