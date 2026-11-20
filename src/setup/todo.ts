import { createTodoService } from '../application/todoService'
import { LocalStorageTodoRepository } from '../infrastructure/localStorageTodoRepository'

const todoRepository = new LocalStorageTodoRepository(window.localStorage)

export const todoService = createTodoService(todoRepository)
