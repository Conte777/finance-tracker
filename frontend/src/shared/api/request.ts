export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  status: number
  detail: string
  fields: FieldErrors

  constructor(status: number, detail: string, fields: FieldErrors = {}) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.fields = fields
  }
}

const statusMessages: Record<number, string> = {
  401: 'Сессия истекла. Войдите снова.',
  403: 'Недостаточно прав для этого действия.',
  404: 'Запись не найдена: возможно, она уже удалена. Обновите страницу.',
  409: 'Действие конфликтует с существующими данными.',
  422: 'Проверьте введённые данные.',
}

export const errorMessage = (error: unknown) =>
  (error instanceof ApiError && statusMessages[error.status]) ||
  'Не удалось связаться с сервером. Попробуйте ещё раз.'

export const queryString = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  const result = search.toString()
  return result ? `?${result}` : ''
}
