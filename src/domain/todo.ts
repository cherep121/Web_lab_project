export type Priority = 0 | 1 | 2 | 3

export interface Task {
  id: string
  userId: string
  title: string
  done: boolean
  createdAt: string
  startDate: string | null
  dueDate: string | null
  priority: Priority
  tags: string[]
}

export interface TaskInput {
  title: string
  startDate?: string | null
  dueDate?: string | null
  priority?: number
  tags?: string[]
}

export type TaskValidationResult =
  | { ok: true; value: Omit<Task, 'id' | 'userId' | 'done' | 'createdAt'> }
  | { ok: false; message: string }

export const PRIORITY_LABELS: Record<Priority, string> = {
  0: 'Низкий',
  1: 'Обычный',
  2: 'Высокий',
  3: 'Срочный'
}

function normalizeDate(
  value: string | null | undefined
): string | null | undefined {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function validateTaskInput(input: TaskInput): TaskValidationResult {
  const title = input.title.trim()
  if (title.length < 2) {
    return { ok: false, message: 'Название должно быть не короче 2 символов.' }
  }

  const priority = input.priority ?? 0
  if (!Number.isInteger(priority) || priority < 0 || priority > 3) {
    return {
      ok: false,
      message: 'Приоритет должен быть целым числом от 0 до 3.'
    }
  }

  const startDate = normalizeDate(input.startDate)
  const dueDate = normalizeDate(input.dueDate)
  if (startDate === undefined || dueDate === undefined) {
    return { ok: false, message: 'Введите корректные дату и время.' }
  }
  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
    return { ok: false, message: 'Дедлайн не может быть раньше даты начала.' }
  }

  const tags = [
    ...new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))
  ]

  return {
    ok: true,
    value: {
      title,
      startDate,
      dueDate,
      priority: priority as Priority,
      tags
    }
  }
}
