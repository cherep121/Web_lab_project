export interface Repository<T extends { id: string }> {
  create(item: T): T
  findById(id: string): T | undefined
  update(id: string, changes: Partial<Omit<T, 'id'>>): T | undefined
  delete(id: string): boolean
}

export class MemoryRepository<T extends { id: string }> implements Repository<T> {
  private readonly items = new Map<string, T>()

  create(item: T): T {
    if (this.items.has(item.id)) {
      throw new Error(`Запись с id «${item.id}» уже существует`)
    }
    this.items.set(item.id, item)
    return item
  }

  findById(id: string): T | undefined {
    return this.items.get(id)
  }

  update(id: string, changes: Partial<Omit<T, 'id'>>): T | undefined {
    const current = this.items.get(id)
    if (!current) return undefined

    const updated = { ...current, ...changes, id: current.id }
    this.items.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.items.delete(id)
  }
}

type Book = {
  id: string
  title: string
  author: string
  year: number
}

const books = new MemoryRepository<Book>()
const cleanCode = books.create({
  id: 'book-1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  year: 2008
})

console.log('Создано:', cleanCode)
console.log('Найдено:', books.findById('book-1'))
console.log('Обновлено:', books.update('book-1', { year: 2009 }))
console.log('Нет записи:', books.findById('missing'))
console.log('Обновление отсутствующей:', books.update('missing', { year: 2026 }))
console.log('Удалена отсутствующая:', books.delete('missing'))
console.log('Удалена существующая:', books.delete('book-1'))

try {
  books.create({ id: 'book-2', title: 'TypeScript', author: 'Boris Cherny', year: 2019 })
  books.create({ id: 'book-2', title: 'Duplicate', author: 'Unknown', year: 2020 })
} catch (error: unknown) {
  if (error instanceof Error) console.log('Ожидаемая ошибка:', error.message)
}
