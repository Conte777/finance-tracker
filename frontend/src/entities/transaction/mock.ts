import type { Transaction, TransactionType } from './model'

type Template = {
  type: TransactionType
  categoryId: string
  day: number
  amount: number
  comment: string
  months?: number[]
}

const MONTHS = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']
const LAST_DATE = '2026-09-20'

const templates: Template[] = [
  { type: 'income', categoryId: 'salary', day: 5, amount: 95000, comment: 'Зарплата, аванс и расчёт' },
  { type: 'income', categoryId: 'freelance', day: 18, amount: 21000, comment: 'Заказ на вёрстку лендинга', months: [0, 2, 4, 5] },
  { type: 'income', categoryId: 'cashback', day: 28, amount: 1300, comment: 'Кэшбэк по карте' },
  { type: 'income', categoryId: 'gifts', day: 14, amount: 10000, comment: 'Подарок на день рождения', months: [3] },
  { type: 'expense', categoryId: 'housing', day: 3, amount: 32000, comment: 'Аренда квартиры' },
  { type: 'expense', categoryId: 'housing', day: 12, amount: 5400, comment: 'Коммунальные платежи' },
  { type: 'expense', categoryId: 'transport', day: 1, amount: 2900, comment: 'Проездной на месяц' },
  { type: 'expense', categoryId: 'transport', day: 19, amount: 720, comment: 'Такси' },
  { type: 'expense', categoryId: 'communication', day: 10, amount: 890, comment: 'Мобильная связь и интернет' },
  { type: 'expense', categoryId: 'groceries', day: 2, amount: 4800, comment: 'Супермаркет' },
  { type: 'expense', categoryId: 'groceries', day: 9, amount: 5600, comment: 'Продукты на неделю' },
  { type: 'expense', categoryId: 'groceries', day: 16, amount: 6100, comment: 'Супермаркет' },
  { type: 'expense', categoryId: 'groceries', day: 23, amount: 4300, comment: 'Рынок' },
  { type: 'expense', categoryId: 'cafe', day: 7, amount: 1850, comment: 'Обед с коллегами' },
  { type: 'expense', categoryId: 'cafe', day: 13, amount: 3400, comment: 'Ужин в ресторане' },
  { type: 'expense', categoryId: 'cafe', day: 20, amount: 2600, comment: 'Кофейня и доставка', months: [1, 3, 5] },
  { type: 'expense', categoryId: 'entertainment', day: 15, amount: 2400, comment: 'Кино и подписки' },
  { type: 'expense', categoryId: 'health', day: 11, amount: 3200, comment: 'Аптека и анализы', months: [0, 2, 3, 5] },
  { type: 'expense', categoryId: 'clothes', day: 17, amount: 7900, comment: 'Кроссовки', months: [1, 4] },
  { type: 'expense', categoryId: 'education', day: 8, amount: 4500, comment: 'Онлайн-курс по TypeScript', months: [2, 5] },
]

const vary = (amount: number, seed: number) => {
  const factor = 1 + (((seed * 7919) % 17) - 8) / 100
  return Math.round((amount * factor) / 10) * 10
}

const pad = (day: number) => String(day).padStart(2, '0')

export const mockTransactions: Transaction[] = MONTHS.flatMap((month, monthIndex) =>
  templates
    .filter((t) => !t.months || t.months.includes(monthIndex))
    .map((t, templateIndex) => ({
      id: `${month}-${templateIndex}`,
      type: t.type,
      categoryId: t.categoryId,
      date: `${month}-${pad(t.day)}`,
      amount: t.categoryId === 'salary' ? t.amount + (monthIndex >= 3 ? 7000 : 0) : vary(t.amount, monthIndex * 31 + templateIndex),
      comment: t.comment,
    })),
)
  .filter((t) => t.date <= LAST_DATE)
  .sort((a, b) => b.date.localeCompare(a.date))
