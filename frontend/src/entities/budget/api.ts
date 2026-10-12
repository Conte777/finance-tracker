import { queryOptions } from '@tanstack/react-query'
import { findCategory } from '@/entities/category/api'
import { ApiError, nextId, respond } from '@/shared/api'
import { mockBudgets } from './mock'
import type { Budget, BudgetInput } from './model'

const rows: Budget[] = mockBudgets.map((budget) => ({ ...budget }))

const RESOURCE = 'budgets'

export const hasBudget = (categoryId: number) => rows.some((b) => b.categoryId === categoryId)

export const deleteBudgetOfCategory = (categoryId: number) => {
  const index = rows.findIndex((b) => b.categoryId === categoryId)
  if (index >= 0) rows.splice(index, 1)
}

const getOrThrow = (id: number) => {
  const budget = rows.find((b) => b.id === id)
  if (!budget) throw new ApiError(404, `Budget ${id} not found`)
  return budget
}

export const listBudgets = () => respond(RESOURCE, () => [...rows].sort((a, b) => a.id - b.id))

export const getBudget = (id: number) => respond(RESOURCE, () => getOrThrow(id))

export const createBudget = (data: BudgetInput) =>
  respond(RESOURCE, () => {
    const category = findCategory(data.categoryId)
    if (!category) throw new ApiError(422, `Category ${data.categoryId} does not exist`)
    if (category.type !== 'expense') throw new ApiError(422, 'Budgets can only be set for expense categories')
    if (hasBudget(data.categoryId)) throw new ApiError(409, `Budget for category ${data.categoryId} already exists`)
    const budget: Budget = { ...data, id: nextId(rows) }
    rows.push(budget)
    return budget
  })

export const updateBudget = (id: number, data: Pick<BudgetInput, 'limit'>) =>
  respond(RESOURCE, () => {
    const budget = getOrThrow(id)
    budget.limit = data.limit
    return budget
  })

export const deleteBudget = (id: number) =>
  respond(RESOURCE, () => {
    getOrThrow(id)
    rows.splice(rows.findIndex((b) => b.id === id), 1)
  })

export const budgetKeys = {
  all: [RESOURCE] as const,
}

export const budgetsQuery = () => queryOptions({ queryKey: budgetKeys.all, queryFn: listBudgets })
