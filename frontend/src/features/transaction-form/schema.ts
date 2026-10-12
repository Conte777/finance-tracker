import { z } from 'zod'

const AMOUNT_PATTERN = /^\d{1,10}([.,]\d{1,2})?$/

export const DEFAULT_DATE = '2026-09-21'

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z
    .string()
    .trim()
    .min(1, 'Введите сумму')
    .regex(AMOUNT_PATTERN, 'Положительное число, не больше двух знаков после запятой')
    .transform((value) => Number(value.replace(',', '.')))
    .refine((value) => value > 0, 'Сумма должна быть больше нуля'),
  categoryId: z.string().min(1, 'Выберите категорию').transform(Number),
  date: z.iso.date('Укажите дату'),
  comment: z.string().max(200, 'Не больше 200 символов'),
})

export type TransactionFormValues = z.input<typeof transactionFormSchema>
export type TransactionFormResult = z.output<typeof transactionFormSchema>
