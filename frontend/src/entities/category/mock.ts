import type { Category } from './model'

export const mockCategories: Category[] = [
  { id: 'salary', name: 'Зарплата', type: 'income', color: '#2e7d32', icon: 'salary' },
  { id: 'freelance', name: 'Фриланс', type: 'income', color: '#00897b', icon: 'freelance' },
  { id: 'cashback', name: 'Кэшбэк и проценты', type: 'income', color: '#7cb342', icon: 'cashback' },
  { id: 'gifts', name: 'Подарки', type: 'income', color: '#c0ca33', icon: 'gift' },
  { id: 'groceries', name: 'Продукты', type: 'expense', color: '#ef6c00', icon: 'groceries' },
  { id: 'cafe', name: 'Кафе и рестораны', type: 'expense', color: '#d81b60', icon: 'cafe' },
  { id: 'transport', name: 'Транспорт', type: 'expense', color: '#1e88e5', icon: 'transport' },
  { id: 'housing', name: 'Жильё и ЖКУ', type: 'expense', color: '#6d4c41', icon: 'housing' },
  { id: 'health', name: 'Здоровье', type: 'expense', color: '#e53935', icon: 'health' },
  { id: 'entertainment', name: 'Развлечения', type: 'expense', color: '#8e24aa', icon: 'entertainment' },
  { id: 'clothes', name: 'Одежда', type: 'expense', color: '#3949ab', icon: 'clothes' },
  { id: 'education', name: 'Образование', type: 'expense', color: '#00acc1', icon: 'education' },
  { id: 'communication', name: 'Связь и интернет', type: 'expense', color: '#546e7a', icon: 'communication' },
]

export const categoryById = new Map(mockCategories.map((category) => [category.id, category]))
