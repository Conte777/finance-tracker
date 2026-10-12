import { queryOptions } from '@tanstack/react-query'
import { findCategory } from '@/entities/category/api'
import { ApiError, nextId, respond } from '@/shared/api'
import { mockTransactions } from './mock'
import type { Transaction, TransactionFilter, TransactionInput, TransactionPage } from './model'

type TransactionRow = TransactionInput & { id: number }

const rows: TransactionRow[] = mockTransactions.map((t) => ({ ...t }))

const RESOURCE = 'transactions'

export const countTransactions = (categoryId: number) => rows.filter((t) => t.categoryId === categoryId).length

const existingCategory = (categoryId: number) => {
  const category = findCategory(categoryId)
  if (!category) throw new ApiError(422, `Category ${categoryId} does not exist`)
  return category
}

const toTransaction = (row: TransactionRow): Transaction => ({ ...row, type: existingCategory(row.categoryId).type })

const getRow = (id: number) => {
  const row = rows.find((t) => t.id === id)
  if (!row) throw new ApiError(404, `Transaction ${id} not found`)
  return row
}

export const listTransactions = ({ type, categoryId, q, dateFrom, dateTo, page = 1, size = 20 }: TransactionFilter = {}) =>
  respond(RESOURCE, (): TransactionPage => {
    const query = q?.toLowerCase()
    const filtered = rows
      .map(toTransaction)
      .filter(
        (t) =>
          (!type || t.type === type) &&
          (!categoryId || t.categoryId === categoryId) &&
          (!query || t.comment.toLowerCase().includes(query)) &&
          (!dateFrom || t.date >= dateFrom) &&
          (!dateTo || t.date <= dateTo),
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    return { items: filtered.slice((page - 1) * size, page * size), total: filtered.length }
  })

export const getTransaction = (id: number) => respond(RESOURCE, () => toTransaction(getRow(id)))

export const createTransaction = (data: TransactionInput) =>
  respond(RESOURCE, () => {
    existingCategory(data.categoryId)
    const row: TransactionRow = { ...data, id: nextId(rows) }
    rows.push(row)
    return toTransaction(row)
  })

export const updateTransaction = (id: number, data: Partial<TransactionInput>) =>
  respond(RESOURCE, () => {
    const row = getRow(id)
    if (data.categoryId !== undefined) existingCategory(data.categoryId)
    Object.assign(row, {
      categoryId: data.categoryId ?? row.categoryId,
      amount: data.amount ?? row.amount,
      date: data.date ?? row.date,
      comment: data.comment ?? row.comment,
    })
    return toTransaction(row)
  })

export const deleteTransaction = (id: number) =>
  respond(RESOURCE, () => {
    getRow(id)
    rows.splice(rows.findIndex((t) => t.id === id), 1)
  })

export const ALL_TRANSACTIONS = 1000

export const transactionKeys = {
  all: [RESOURCE] as const,
  list: (filter: TransactionFilter) => [RESOURCE, filter] as const,
}

export const transactionsQuery = (filter: TransactionFilter) =>
  queryOptions({ queryKey: transactionKeys.list(filter), queryFn: () => listTransactions(filter) })
