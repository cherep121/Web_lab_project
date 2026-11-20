import type { Task } from './todo'

function dateValue(value: string | null): number {
  if (!value) return Number.POSITIVE_INFINITY
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp
}

function compareDates(first: string | null, second: string | null): number {
  const firstValue = dateValue(first)
  const secondValue = dateValue(second)
  if (firstValue === secondValue) return 0
  return firstValue < secondValue ? -1 : 1
}

export function sortTasks(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((first, second) => {
    const byCompletion = Number(first.done) - Number(second.done)
    if (byCompletion !== 0) return byCompletion

    const byPriority = second.priority - first.priority
    if (byPriority !== 0) return byPriority

    const byDueDate = compareDates(first.dueDate, second.dueDate)
    if (byDueDate !== 0) return byDueDate

    const byStartDate = compareDates(first.startDate, second.startDate)
    if (byStartDate !== 0) return byStartDate

    return compareDates(first.createdAt, second.createdAt)
  })
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isDueToday(task: Task, now: Date): boolean {
  if (!task.dueDate) return false
  const dueDate = new Date(task.dueDate)
  if (Number.isNaN(dueDate.getTime())) return false
  return startOfDay(dueDate).getTime() === startOfDay(now).getTime()
}

export function isDueThisWeek(task: Task, now: Date): boolean {
  if (!task.dueDate) return false
  const dueDate = new Date(task.dueDate)
  if (Number.isNaN(dueDate.getTime())) return false

  const today = startOfDay(now)
  const dayFromMonday = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayFromMonday)
  const nextMonday = new Date(monday)
  nextMonday.setDate(monday.getDate() + 7)

  return dueDate >= monday && dueDate < nextMonday
}
