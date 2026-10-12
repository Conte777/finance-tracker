import { z } from 'zod'
import { categoryIconKeys } from '@/entities/category'

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Введите название').max(50, 'Не больше 50 символов'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Выберите цвет'),
  icon: z.enum(categoryIconKeys, 'Выберите иконку'),
})

export type CategoryFormValues = z.input<typeof categoryFormSchema>
