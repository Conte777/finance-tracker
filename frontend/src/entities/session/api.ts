import { queryOptions } from '@tanstack/react-query'
import { ApiError, apiRequest, setAccessToken } from '@/shared/api'
import type { LoginInput, RegisterInput, User } from './model'

type TokenResponse = {
  access_token: string
}

const fetchCurrentUser = () => apiRequest<User>('/auth/me')

const getSession = async () => {
  try {
    return await fetchCurrentUser()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

const startSession = async (path: string, body: LoginInput | RegisterInput) => {
  const { access_token } = await apiRequest<TokenResponse>(path, { method: 'POST', body, auth: false })
  setAccessToken(access_token)
  return fetchCurrentUser()
}

export const login = (data: LoginInput) => startSession('/auth/login', data)

export const register = (data: RegisterInput) => startSession('/auth/register', data)

export const logout = async () => {
  try {
    await apiRequest<void>('/auth/logout', { method: 'POST', auth: false })
  } finally {
    setAccessToken(null)
  }
}

export const sessionKeys = {
  all: ['session'] as const,
}

export const sessionQuery = () =>
  queryOptions({ queryKey: sessionKeys.all, queryFn: getSession, staleTime: Infinity })
