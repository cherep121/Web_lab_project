import { defineStore } from 'pinia'

function createTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `task-${crypto.randomUUID()}`
  }
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const useTodoStore = defineStore('todos', {
  state: () => ({ tasks: [] }),

  getters: {
    tasksForUser: (state) => (userId) => state.tasks.filter((task) => task.userId === userId)
  },

  actions: {
    addTask(userId, title) {
      this.tasks.push({
        id: createTaskId(),
        userId,
        title,
        done: false,
        createdAt: new Date().toISOString()
      })
    },

    updateTask(userId, taskId, title) {
      const task = this.tasks.find((item) => item.id === taskId && item.userId === userId)
      if (task) task.title = title
    },

    toggleTask(userId, taskId, done) {
      const task = this.tasks.find((item) => item.id === taskId && item.userId === userId)
      if (task) task.done = done
    },

    deleteTask(userId, taskId) {
      this.tasks = this.tasks.filter((item) => item.id !== taskId || item.userId !== userId)
    }
  },

  persist: {
    key: 'taskspace.tasks',
    pick: ['tasks']
  }
})
