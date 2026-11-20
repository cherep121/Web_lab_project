import { defineStore } from 'pinia'
import type { Task } from '../types/todo'

function createTaskId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `task-${crypto.randomUUID()}`
  }
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const useTodoStore = defineStore('todos', {
  state: () => ({ tasks: [] as Task[] }),

  getters: {
    tasksForUser:
      (state) =>
      (userId: string): Task[] =>
        state.tasks.filter((task) => task.userId === userId)
  },

  actions: {
    addTask(userId: string, title: string): void {
      this.tasks.push({
        id: createTaskId(),
        userId,
        title,
        done: false,
        createdAt: new Date().toISOString()
      })
    },

    updateTask(userId: string, taskId: string, title: string): void {
      const task = this.tasks.find(
        (item) => item.id === taskId && item.userId === userId
      )
      if (task) task.title = title
    },

    toggleTask(userId: string, taskId: string, done: boolean): void {
      const task = this.tasks.find(
        (item) => item.id === taskId && item.userId === userId
      )
      if (task) task.done = done
    },

    deleteTask(userId: string, taskId: string): void {
      this.tasks = this.tasks.filter(
        (item) => item.id !== taskId || item.userId !== userId
      )
    }
  },

  persist: {
    key: 'taskspace.tasks',
    pick: ['tasks']
  }
})
