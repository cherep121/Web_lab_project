export function addTag(tags: readonly string[], tag: string): string[] {
  return tags.includes(tag) ? [...tags] : [...tags, tag]
}

export function removeTag(tags: readonly string[], tag: string): string[] {
  return tags.filter((currentTag) => currentTag !== tag)
}

export function mergeTags(first: readonly string[], second: readonly string[]): string[] {
  return [...new Set([...first, ...second])]
}

const originalTags = ['typescript', 'node', 'TypeScript'] as const
const additionalTags = ['node', 'npm', 'strict'] as const

console.log('Добавление:', addTag(originalTags, 'generics'))
console.log('Без повтора:', addTag(originalTags, 'node'))
console.log('Удаление:', removeTag(['node', 'npm', 'node'], 'node'))
console.log('Объединение:', mergeTags(originalTags, additionalTags))
console.log('Исходники сохранены:', originalTags, additionalTags)
