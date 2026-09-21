import type { CategoryType } from '@/entities/category'

export type TransactionType = CategoryType

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  date: string
  comment: string
}

export const CURRENT_MONTH = '2026-09'

export const isInMonth = (transaction: Transaction, month: string) =>
  transaction.date.startsWith(month)

export const sumAmount = (transactions: Transaction[], type: TransactionType) =>
  transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0)

export const sumByCategory = (transactions: Transaction[]) => {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount)
  }
  return totals
}
