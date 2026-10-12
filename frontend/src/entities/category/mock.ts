import type { Category } from './model'

export const mockCategories: Category[] = [
  { id: 1, name: 'Зарплата', type: 'income', color: '#2e7d32', icon: 'salary' },
  { id: 2, name: 'Фриланс', type: 'income', color: '#00897b', icon: 'freelance' },
  { id: 3, name: 'Кэшбэк и проценты', type: 'income', color: '#7cb342', icon: 'cashback' },
  { id: 4, name: 'Подарки', type: 'income', color: '#c0ca33', icon: 'gift' },
  { id: 5, name: 'Продукты', type: 'expense', color: '#ef6c00', icon: 'groceries' },
  { id: 6, name: 'Кафе и рестораны', type: 'expense', color: '#d81b60', icon: 'cafe' },
  { id: 7, name: 'Транспорт', type: 'expense', color: '#1e88e5', icon: 'transport' },
  { id: 8, name: 'Жильё и ЖКУ', type: 'expense', color: '#6d4c41', icon: 'housing' },
  { id: 9, name: 'Здоровье', type: 'expense', color: '#e53935', icon: 'health' },
  { id: 10, name: 'Развлечения', type: 'expense', color: '#8e24aa', icon: 'entertainment' },
  { id: 11, name: 'Одежда', type: 'expense', color: '#3949ab', icon: 'clothes' },
  { id: 12, name: 'Образование', type: 'expense', color: '#00acc1', icon: 'education' },
  { id: 13, name: 'Связь и интернет', type: 'expense', color: '#546e7a', icon: 'communication' },
]
