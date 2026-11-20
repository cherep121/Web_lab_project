import { validateTaskInput, type Task, type TaskInput } from '../domain/todo'
import type { TodoRepository } from './TodoRepository'

export type TaskChangeResult =
  { ok: true; tasks: Task[] } | { ok: false; message: string }

function createTaskId(): string {
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function createTodoService(repository: TodoRepository) {
  function save(userId: string, tasks: Task[]): Task[] {
    repository.save(userId, tasks)
    return tasks
  }

  return {
    load(userId: string): Task[] {
      return repository.load(userId)
    },

    create(userId: string, input: TaskInput): TaskChangeResult {
      const validation = validateTaskInput(input)
      if (!validation.ok) return validation

      const task: Task = {
        id: createTaskId(),
        userId,
        done: false,
        createdAt: new Date().toISOString(),
        ...validation.value
      }
      return {
        ok: true,
        tasks: save(userId, [...repository.load(userId), task])
      }
    },

    update(userId: string, taskId: string, input: TaskInput): TaskChangeResult {
      const validation = validateTaskInput(input)
      if (!validation.ok) return validation

      const tasks = repository.load(userId)
      if (!tasks.some((task) => task.id === taskId)) {
        return { ok: false, message: 'Задача не найдена.' }
      }
      const updated = tasks.map((task) =>
        task.id === taskId ? { ...task, ...validation.value } : task
      )
      return { ok: true, tasks: save(userId, updated) }
    },

    toggle(userId: string, taskId: string, done: boolean): Task[] {
      const tasks = repository
        .load(userId)
        .map((task) => (task.id === taskId ? { ...task, done } : task))
      return save(userId, tasks)
    },

    remove(userId: string, taskId: string): Task[] {
      const tasks = repository.load(userId).filter((task) => task.id !== taskId)
      return save(userId, tasks)
    }
  }
}

export type TodoService = ReturnType<typeof createTodoService>
