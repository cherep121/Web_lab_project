import { defineStore } from 'pinia'
import type { Task, TaskInput } from '../domain/todo'
import { todoService } from '../setup/todo'

export const useTodoStore = defineStore('todos', {
  state: () => ({ tasks: [] as Task[] }),

  getters: {
    tasksForUser:
      (state) =>
      (userId: string): Task[] =>
        state.tasks.filter((task) => task.userId === userId)
  },

  actions: {
    loadTasks(userId: string): void {
      this.tasks = todoService.load(userId)
    },

    clearTasks(): void {
      this.tasks = []
    },

    addTask(userId: string, input: TaskInput) {
      const result = todoService.create(userId, input)
      if (result.ok) this.tasks = result.tasks
      return result
    },

    updateTask(userId: string, taskId: string, input: TaskInput) {
      const result = todoService.update(userId, taskId, input)
      if (result.ok) this.tasks = result.tasks
      return result
    },

    toggleTask(userId: string, taskId: string, done: boolean): void {
      this.tasks = todoService.toggle(userId, taskId, done)
    },

    deleteTask(userId: string, taskId: string): void {
      this.tasks = todoService.remove(userId, taskId)
    }
  }
})
