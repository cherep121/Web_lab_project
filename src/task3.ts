export type UserId = string & { readonly brand: unique symbol }

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUserId(value: unknown): value is UserId {
  return typeof value === 'string' && uuidPattern.test(value)
}

type UserProfile = {
  id: UserId
  name: string
  role: string
}

function getUserProfile(id: UserId): UserProfile {
  return { id, name: 'Антон', role: 'student' }
}

const candidates: unknown[] = [
  '123e4567-e89b-12d3-a456-426614174000',
  'not-a-uuid',
  12345
]

for (const candidate of candidates) {
  if (isUserId(candidate)) {
    console.log('Профиль:', getUserProfile(candidate))
  } else {
    console.log('Некорректный UserId:', candidate)
  }
}
