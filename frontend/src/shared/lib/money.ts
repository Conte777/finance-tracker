import { z } from 'zod'

const MONEY_PATTERN = /^\d{1,10}([.,]\d{1,2})?$/

type MoneyMessages = {
  required: string
  positive: string
}

export const moneySchema = (messages: MoneyMessages) =>
  z
    .string()
    .trim()
    .min(1, messages.required)
    .regex(MONEY_PATTERN, 'Положительное число, не больше двух знаков после запятой')
    .transform((value) => Number(value.replace(',', '.')))
    .refine((value) => value > 0, messages.positive)
