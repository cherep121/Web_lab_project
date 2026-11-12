type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type DeepReadonly<T> =
  T extends Primitive ? T
    : T extends readonly (infer Item)[] ? readonly DeepReadonly<Item>[]
      : T extends object ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
        : T

export function deepFreeze<T>(obj: T): DeepReadonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj as DeepReadonly<T>
  }

  // По условию вход состоит только из обычных объектов, массивов и примитивов.
  // Утверждение даёт Object.values доступ к строковым полям без потери T снаружи.
  const values = Object.values(obj as Record<string, unknown>)
  values.forEach((value) => deepFreeze(value))

  return Object.freeze(obj) as DeepReadonly<T>
}

const settings = deepFreeze({
  project: 'TypeScript Lab',
  owner: {
    name: 'Антон',
    contacts: { city: 'Новосибирск' }
  },
  tasks: [
    { id: 1, title: 'Типы', completed: true },
    { id: 2, title: 'Обобщения', completed: false }
  ]
})

console.log('Заморожен корень:', Object.isFrozen(settings))
console.log('Заморожен owner:', Object.isFrozen(settings.owner))
console.log('Заморожены contacts:', Object.isFrozen(settings.owner.contacts))
console.log('Заморожен массив:', Object.isFrozen(settings.tasks))
console.log('Заморожен элемент:', Object.isFrozen(settings.tasks[0]))
console.log('Данные:', settings)

// Ошибка типов: readonly-поле нельзя изменить.
// settings.owner.name = 'Другое имя'
// Ошибка типов: readonly-массив не поддерживает push.
// settings.tasks.push({ id: 3, title: 'Ошибка', completed: false })
