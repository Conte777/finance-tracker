import { categoryTypeLabels, type Category } from '@/entities/category'
import type { Transaction } from '@/entities/transaction'

const SEPARATOR = ';'

const cell = (value: string) => (/[";\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)

export const toCsv = (transactions: Transaction[], categoryById: Map<number, Category>) => {
  const header = ['Дата', 'Тип', 'Категория', 'Сумма', 'Комментарий']
  const rows = transactions.map((t) => [
    t.date,
    categoryTypeLabels[t.type],
    categoryById.get(t.categoryId)?.name ?? '',
    t.amount.toFixed(2).replace('.', ','),
    t.comment,
  ])
  return [header, ...rows].map((row) => row.map(cell).join(SEPARATOR)).join('\r\n')
}
