import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/shared/api'
import type { Category, CategoryInput } from './model'

export const listCategories = () => apiRequest<Category[]>('/categories')

export const createCategory = (data: CategoryInput) =>
  apiRequest<Category>('/categories', { method: 'POST', body: data })

export const updateCategory = (id: number, data: Partial<CategoryInput>) =>
  apiRequest<Category>(`/categories/${id}`, { method: 'PATCH', body: data })

export const deleteCategory = (id: number) => apiRequest<void>(`/categories/${id}`, { method: 'DELETE' })

export const categoryKeys = {
  all: ['categories'] as const,
}

export const categoriesQuery = () => queryOptions({ queryKey: categoryKeys.all, queryFn: listCategories })
