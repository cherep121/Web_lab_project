import { defineStore } from 'pinia'

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
      if (this.users.some((user) => user.email === normalizedEmail)) {
        return { ok: false, message: 'Пользователь с таким email уже зарегистрирован.' }
      }

      this.users.push({ id: createId('user'), email: normalizedEmail, password })
      return { ok: true }
    },

    login(email, password) {
      const normalizedEmail = normalizeEmail(email)
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
