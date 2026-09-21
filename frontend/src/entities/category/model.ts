export type CategoryType = 'income' | 'expense'

export type CategoryIconKey =
  | 'salary'
  | 'freelance'
  | 'cashback'
  | 'gift'
  | 'groceries'
  | 'cafe'
  | 'transport'
  | 'housing'
  | 'health'
  | 'entertainment'
  | 'clothes'
  | 'education'
  | 'communication'

export type Category = {
  id: string
  name: string
  type: CategoryType
  color: string
  icon: CategoryIconKey
}

export const categoryTypeLabels: Record<CategoryType, string> = {
  income: 'Доходы',
  expense: 'Расходы',
}
