export type CategoryType = 'income' | 'expense'

export const categoryIconKeys = [
  'salary',
  'freelance',
  'cashback',
  'gift',
  'groceries',
  'cafe',
  'transport',
  'housing',
  'health',
  'entertainment',
  'clothes',
  'education',
  'communication',
] as const

export type CategoryIconKey = (typeof categoryIconKeys)[number]

export const categoryColors = [
  '#2e7d32',
  '#00897b',
  '#7cb342',
  '#c0ca33',
  '#ef6c00',
  '#d81b60',
  '#1e88e5',
  '#6d4c41',
  '#e53935',
  '#8e24aa',
  '#3949ab',
  '#00acc1',
  '#546e7a',
]

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
