import { queryOptions } from '@tanstack/react-query'
import { countTransactions } from '@/entities/transaction/api'
import { deleteBudgetOfCategory, hasBudget } from '@/entities/budget/api'
import { ApiError, nextId, respond } from '@/shared/api'
import { mockCategories } from './mock'
import type { Category, CategoryInput, CategoryType } from './model'

const rows: Category[] = mockCategories.map((category) => ({ ...category }))

const RESOURCE = 'categories'

export const findCategory = (id: number) => rows.find((category) => category.id === id)

const getOrThrow = (id: number) => {
  const category = findCategory(id)
  if (!category) throw new ApiError(404, `Category ${id} not found`)
  return category
}

const ensureNameFree = (name: string, type: CategoryType, excludeId?: number) => {
  if (rows.some((c) => c.name === name && c.type === type && c.id !== excludeId)) {
    throw new ApiError(409, `Category '${name}' already exists for type '${type}'`)
  }
}

export const listCategories = (type?: CategoryType) =>
  respond(RESOURCE, () => rows.filter((c) => !type || c.type === type))

export const getCategory = (id: number) => respond(RESOURCE, () => getOrThrow(id))

export const createCategory = (data: CategoryInput) =>
  respond(RESOURCE, () => {
    const name = data.name.trim()
    ensureNameFree(name, data.type)
    const category: Category = { ...data, name, id: nextId(rows) }
    rows.push(category)
    return category
  })

export const updateCategory = (id: number, data: Partial<CategoryInput>) =>
  respond(RESOURCE, () => {
    const category = getOrThrow(id)
    const name = data.name?.trim() ?? category.name
    const type = data.type ?? category.type
    if (type !== category.type) {
      const count = countTransactions(id)
      if (count > 0) {
        throw new ApiError(409, `Cannot change type of category ${id}: it has ${count} transactions`)
      }
      if (hasBudget(id)) {
        throw new ApiError(409, `Cannot change type of category ${id}: it has a budget, delete it first`)
      }
    }
    if (name !== category.name || type !== category.type) ensureNameFree(name, type, id)
    Object.assign(category, { name, type, color: data.color ?? category.color, icon: data.icon ?? category.icon })
    return category
  })

export const deleteCategory = (id: number) =>
  respond(RESOURCE, () => {
    getOrThrow(id)
    const count = countTransactions(id)
    if (count > 0) {
      throw new ApiError(409, `Cannot delete category ${id}: it has ${count} transactions, delete or move them first`)
    }
    deleteBudgetOfCategory(id)
    rows.splice(rows.findIndex((c) => c.id === id), 1)
  })

export const categoryKeys = {
  all: [RESOURCE] as const,
}

export const categoriesQuery = () =>
  queryOptions({ queryKey: categoryKeys.all, queryFn: () => listCategories() })
