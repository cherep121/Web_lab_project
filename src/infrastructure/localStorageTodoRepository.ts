import type { TodoRepository } from '../application/TodoRepository'
import type { Priority, Task } from '../domain/todo'

const STORAGE_KEY = 'taskspace.tasks'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function storedDate(value: unknown): string | null {
  if (typeof value !== 'string' || Number.isNaN(new Date(value).getTime()))
    return null
  return value
}

function normalizeStoredTask(value: unknown): Task | null {
  if (!isRecord(value)) return null
  if (
    typeof value.id !== 'string' ||
    typeof value.userId !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.done !== 'boolean'
  ) {
    return null
  }

  const priority =
    typeof value.priority === 'number' &&
    Number.isInteger(value.priority) &&
    value.priority >= 0 &&
    value.priority <= 3
      ? (value.priority as Priority)
      : 0
  const tags = Array.isArray(value.tags)
    ? [
        ...new Set(
          value.tags.filter((tag): tag is string => typeof tag === 'string')
        )
      ]
    : []

  return {
    id: value.id,
    userId: value.userId,
    title: value.title,
    done: value.done,
    createdAt: storedDate(value.createdAt) ?? new Date(0).toISOString(),
    startDate: storedDate(value.startDate),
    dueDate: storedDate(value.dueDate),
    priority,
    tags
  }
}

export class LocalStorageTodoRepository implements TodoRepository {
  constructor(private readonly storage: Storage) {}

  private readAll(): Task[] {
    try {
      const raw = this.storage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      const values = Array.isArray(parsed)
        ? parsed
        : isRecord(parsed) && Array.isArray(parsed.tasks)
          ? parsed.tasks
          : []
      const unique = new Map<string, Task>()
      for (const value of values) {
        const task = normalizeStoredTask(value)
        if (task) unique.set(task.id, task)
      }
      return [...unique.values()]
    } catch (error) {
      console.warn('Не удалось прочитать задачи из localStorage:', error)
      return []
    }
  }

  load(userId: string): Task[] {
    return this.readAll().filter((task) => task.userId === userId)
  }

  save(userId: string, tasks: readonly Task[]): void {
    try {
      const otherUsersTasks = this.readAll().filter(
        (task) => task.userId !== userId
      )
      this.storage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tasks: [...otherUsersTasks, ...tasks] })
      )
    } catch (error) {
      console.warn('Не удалось сохранить задачи в localStorage:', error)
    }
  }
}
