export interface User {
  id: string
  email: string
  password: string
}

export type AuthResult = { ok: true } | { ok: false; message: string }

export type RegisterResult =
  { ok: true } | { ok: false; field: 'email' | 'password'; message: string }
