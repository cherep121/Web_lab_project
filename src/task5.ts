export function applyPipeline<A, B>(value: A, step1: (value: A) => B): B
export function applyPipeline<A, B, C>(
  value: A,
  step1: (value: A) => B,
  step2: (value: B) => C
): C
export function applyPipeline<A, B, C, D>(
  value: A,
  step1: (value: A) => B,
  step2: (value: B) => C,
  step3: (value: C) => D
): D
export function applyPipeline(
  value: unknown,
  ...steps: readonly ((value: never) => unknown)[]
): unknown {
  return steps.reduce<unknown>((current, step) => {
    // Перегрузки связывают соседние типы, поэтому текущий результат подходит
    // следующему шагу. Утверждение нужно только внутри общей реализации.
    return step(current as never)
  }, value)
}

const doubled = applyPipeline(6, (value) => value * 2)
const described = applyPipeline(6, (value) => value * 2, (value) => `Результат: ${value}`)
const decorated = applyPipeline(
  6,
  (value) => value * 2,
  (value) => `Результат: ${value}`,
  (value) => value.toUpperCase()
)

console.log('Один шаг:', doubled)
console.log('Два шага:', described)
console.log('Три шага:', decorated)

// Ошибка типов: второй шаг ожидает boolean, но первый возвращает number.
// applyPipeline(5, (value) => value * 2, (value: boolean) => String(value))
