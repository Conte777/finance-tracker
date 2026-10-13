import { queryOptions } from '@tanstack/react-query'
import { apiRequest, queryString } from '@/shared/api'
import type { Transaction, TransactionFilter, TransactionInput, TransactionPage } from './model'

type TransactionDto = Omit<Transaction, 'categoryId'> & {
  category_id: number
}

type TransactionPageDto = {
  items: TransactionDto[]
  total: number
}

const MAX_PAGE_SIZE = 100

const toTransaction = ({ category_id, ...rest }: TransactionDto): Transaction => ({ ...rest, categoryId: category_id })

const toBody = (data: Partial<TransactionInput>) => ({
  category_id: data.categoryId,
  amount: data.amount,
  date: data.date,
  comment: data.comment,
})

export const listTransactions = async ({ type, categoryId, q, dateFrom, dateTo, page, size }: TransactionFilter = {}) => {
  const path = `/transactions${queryString({ type, category_id: categoryId, q, date_from: dateFrom, date_to: dateTo, page, size })}`
  const { items, total } = await apiRequest<TransactionPageDto>(path)
  return { items: items.map(toTransaction), total } satisfies TransactionPage
}

export const listAllTransactions = async (filter: Omit<TransactionFilter, 'page' | 'size'> = {}) => {
  const first = await listTransactions({ ...filter, page: 1, size: MAX_PAGE_SIZE })
  const pageCount = Math.ceil(first.total / MAX_PAGE_SIZE)
  const rest = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      listTransactions({ ...filter, page: index + 2, size: MAX_PAGE_SIZE }),
    ),
  )
  return [first, ...rest].flatMap((page) => page.items)
}

export const createTransaction = async (data: TransactionInput) =>
  toTransaction(await apiRequest<TransactionDto>('/transactions', { method: 'POST', body: toBody(data) }))

export const updateTransaction = async (id: number, data: Partial<TransactionInput>) =>
  toTransaction(await apiRequest<TransactionDto>(`/transactions/${id}`, { method: 'PATCH', body: toBody(data) }))

export const deleteTransaction = (id: number) => apiRequest<void>(`/transactions/${id}`, { method: 'DELETE' })

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filter: TransactionFilter) => [...transactionKeys.all, 'list', filter] as const,
  everything: (filter: Omit<TransactionFilter, 'page' | 'size'>) => [...transactionKeys.all, 'all', filter] as const,
}

export const transactionsQuery = (filter: TransactionFilter) =>
  queryOptions({ queryKey: transactionKeys.list(filter), queryFn: () => listTransactions(filter) })

export const allTransactionsQuery = (filter: Omit<TransactionFilter, 'page' | 'size'> = {}) =>
  queryOptions({ queryKey: transactionKeys.everything(filter), queryFn: () => listAllTransactions(filter) })
