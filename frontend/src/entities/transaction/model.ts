import type { CategoryType } from '@/entities/category'

export type TransactionType = CategoryType

export type Transaction = {
  id: number
  type: TransactionType
  amount: number
  categoryId: number
  date: string
  comment: string
}

export type TransactionInput = Omit<Transaction, 'id' | 'type'>

export type TransactionFilter = {
  type?: TransactionType
  categoryId?: number
  q?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
}

export type TransactionPage = {
  items: Transaction[]
  total: number
}

export const CURRENT_MONTH = '2026-09'

export const monthRange = (month: string) => {
  const [year, monthIndex] = month.split('-').map(Number)
  const lastDay = new Date(year, monthIndex, 0).getDate()
  return { dateFrom: `${month}-01`, dateTo: `${month}-${String(lastDay).padStart(2, '0')}` }
}

export const isInMonth = (transaction: Transaction, month: string) =>
  transaction.date.startsWith(month)

export const sumAmount = (transactions: Transaction[], type: TransactionType) =>
  transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0)

export const sumByCategory = (transactions: Transaction[]) => {
  const totals = new Map<number, number>()
  for (const t of transactions) {
    totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount)
  }
  return totals
}
