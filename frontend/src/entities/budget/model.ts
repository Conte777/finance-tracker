export type Budget = {
  id: number
  categoryId: number
  limit: number
}

export type BudgetInput = Omit<Budget, 'id'>
