import { z } from 'zod'
import { moneySchema } from '@/shared/lib/money'

export const DEFAULT_DATE = '2026-09-21'

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: moneySchema({ required: 'Введите сумму', positive: 'Сумма должна быть больше нуля' }),
  categoryId: z.string().min(1, 'Выберите категорию').transform(Number),
  date: z.iso.date('Укажите дату'),
  comment: z.string().max(200, 'Не больше 200 символов'),
})

export type TransactionFormValues = z.input<typeof transactionFormSchema>
export type TransactionFormResult = z.output<typeof transactionFormSchema>
