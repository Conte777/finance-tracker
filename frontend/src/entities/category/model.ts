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
  id: number
  name: string
  type: CategoryType
  color: string
  icon: CategoryIconKey
}

export type CategoryInput = Omit<Category, 'id'>

export const categoryTypeLabels: Record<CategoryType, string> = {
  income: 'Доходы',
  expense: 'Расходы',
}

export const indexCategories = (categories: Category[]) =>
  new Map(categories.map((category) => [category.id, category]))
