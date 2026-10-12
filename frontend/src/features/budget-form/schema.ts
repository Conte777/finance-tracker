import { z } from 'zod'
import { moneySchema } from '@/shared/lib/money'

export const budgetFormSchema = z.object({
  categoryId: z.string().min(1, 'Выберите категорию').transform(Number),
  limit: moneySchema({ required: 'Введите лимит', positive: 'Лимит должен быть больше нуля' }),
})

export type BudgetFormValues = z.input<typeof budgetFormSchema>
export type BudgetFormResult = z.output<typeof budgetFormSchema>
