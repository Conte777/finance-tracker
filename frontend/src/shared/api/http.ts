import { ApiError } from './request'

const BASE_URL = '/api'

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
}

type TokenResponse = {
  access_token: string
}

type ErrorBody = {
  detail?: string | { msg: string }[]
}

let accessToken: string | null = null
let refreshing: Promise<string | null> | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

const send = (path: string, { method = 'GET', body }: RequestOptions, token: string | null) =>
  fetch(BASE_URL + path, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

const toApiError = async (response: Response) => {
  const { detail } = ((await response.json().catch(() => ({}))) as ErrorBody)
  const message = Array.isArray(detail) ? detail.map((item) => item.msg).join('; ') : detail
  return new ApiError(response.status, message ?? response.statusText)
}

const refresh = async () => {
  const response = await send('/auth/refresh', { method: 'POST' }, null)
  accessToken = response.ok ? ((await response.json()) as TokenResponse).access_token : null
  return accessToken
}

export const refreshAccessToken = () =>
  (refreshing ??= refresh().finally(() => {
    refreshing = null
  }))

const sendAuthorized = async (path: string, options: RequestOptions) => {
  const token = accessToken ?? (await refreshAccessToken())
  const response = await send(path, options, token)
  if (response.status !== 401 || token === null) return response

  const fresh = accessToken !== token ? accessToken : await refreshAccessToken()
  return fresh ? send(path, options, fresh) : response
}

export async function apiRequest<T>(path: string, { auth = true, ...options }: RequestOptions = {}): Promise<T> {
  const response = auth ? await sendAuthorized(path, options) : await send(path, options, null)
  if (!response.ok) throw await toApiError(response)
  return (response.status === 204 ? undefined : await response.json()) as T
}
