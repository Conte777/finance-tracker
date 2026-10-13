export type User = {
  id: number
  email: string
  name: string
}

export type LoginInput = {
  email: string
  password: string
  remember: boolean
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export const userInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
