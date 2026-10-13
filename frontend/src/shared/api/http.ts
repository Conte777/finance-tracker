import { ApiError, type FieldErrors } from './request'

const BASE_URL = '/api'

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
}

type TokenResponse = {
  access_token: string
}

type ValidationIssue = {
  type: string
  loc: (string | number)[]
  msg: string
  ctx?: Record<string, unknown>
}

type ErrorBody = {
  detail?: string | ValidationIssue[]
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

const toCamelCase = (name: string) => name.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())

const issueMessage = ({ type, ctx }: ValidationIssue) => {
  switch (type) {
    case 'missing':
    case 'string_too_short':
      return 'Заполните поле'
    case 'string_too_long':
      return `Не больше ${String(ctx?.max_length)} символов`
    case 'greater_than':
      return `Значение должно быть больше ${String(ctx?.gt)}`
    case 'decimal_max_places':
      return 'Не больше двух знаков после запятой'
    case 'decimal_max_digits':
      return 'Слишком большое число'
    default:
      return 'Некорректное значение'
  }
}

const toFieldErrors = (issues: ValidationIssue[]): FieldErrors =>
  Object.fromEntries(
    issues
      .filter(({ loc }) => loc.length > 1)
      .map((issue) => [toCamelCase(String(issue.loc[issue.loc.length - 1])), issueMessage(issue)]),
  )

const toApiError = async (response: Response) => {
  const { detail } = (await response.json().catch(() => ({}))) as ErrorBody
  if (Array.isArray(detail)) {
    return new ApiError(response.status, detail.map((item) => item.msg).join('; '), toFieldErrors(detail))
  }
  return new ApiError(response.status, detail ?? response.statusText)
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
