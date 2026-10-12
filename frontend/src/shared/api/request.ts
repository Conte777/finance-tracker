const DELAY_MS = 400

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

const failingResource = () =>
  import.meta.env.DEV ? new URLSearchParams(window.location.search).get('fail') : null

export async function respond<T>(resource: string, handler: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
  if (failingResource() === resource) {
    throw new ApiError(500, 'Internal Server Error')
  }
  return structuredClone(handler())
}

export const nextId = (rows: { id: number }[]) => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1

export const errorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status < 500) return error.detail
  return 'Не удалось связаться с сервером. Попробуйте ещё раз.'
}
