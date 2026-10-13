import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/shared/api'

const serverFieldErrors = <T extends FieldValues>(error: unknown, fields: readonly Path<T>[]) =>
  error instanceof ApiError
    ? fields.flatMap((field) => (field in error.fields ? [[field, error.fields[field]] as const] : []))
    : []

export const applyServerFieldErrors = <T extends FieldValues>(
  error: unknown,
  fields: readonly Path<T>[],
  setError: UseFormSetError<T>,
) => {
  const errors = serverFieldErrors<T>(error, fields)
  for (const [field, message] of errors) setError(field, { message })
  return errors.length > 0
}

export const isApiStatus = (error: unknown, status: number) => error instanceof ApiError && error.status === status
