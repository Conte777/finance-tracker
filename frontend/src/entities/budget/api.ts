import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/shared/api'
import type { Budget, BudgetInput } from './model'

type BudgetDto = {
  id: number
  category_id: number
  limit: number
}

const toBudget = (dto: BudgetDto): Budget => ({ id: dto.id, categoryId: dto.category_id, limit: dto.limit })

export const listBudgets = async () => (await apiRequest<BudgetDto[]>('/budgets')).map(toBudget)

export const createBudget = async (data: BudgetInput) =>
  toBudget(
    await apiRequest<BudgetDto>('/budgets', {
      method: 'POST',
      body: { category_id: data.categoryId, limit: data.limit },
    }),
  )

export const updateBudget = async (id: number, data: Pick<BudgetInput, 'limit'>) =>
  toBudget(await apiRequest<BudgetDto>(`/budgets/${id}`, { method: 'PATCH', body: { limit: data.limit } }))

export const deleteBudget = (id: number) => apiRequest<void>(`/budgets/${id}`, { method: 'DELETE' })

export const budgetKeys = {
  all: ['budgets'] as const,
}

export const budgetsQuery = () => queryOptions({ queryKey: budgetKeys.all, queryFn: listBudgets })
