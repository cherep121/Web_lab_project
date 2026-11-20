import type { TodoRepository } from '../application/TodoRepository'
import type { Task } from '../domain/todo'

export class MemoryTodoRepository implements TodoRepository {
  private readonly tasksByUser = new Map<string, Task[]>()

  load(userId: string): Task[] {
    return [...(this.tasksByUser.get(userId) ?? [])]
  }

  save(userId: string, tasks: readonly Task[]): void {
    this.tasksByUser.set(userId, [...tasks])
  }
}
