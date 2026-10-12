import type { TransactionInput } from './model'

type Template = {
  categoryId: number
  day: number
  amount: number
  comment: string
  months?: number[]
}

const MONTHS = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']
const LAST_DATE = '2026-09-20'
const SALARY = 1

const templates: Template[] = [
  { categoryId: SALARY, day: 5, amount: 95000, comment: 'Зарплата, аванс и расчёт' },
  { categoryId: 2, day: 18, amount: 21000, comment: 'Заказ на вёрстку лендинга', months: [0, 2, 4, 5] },
  { categoryId: 3, day: 28, amount: 1300, comment: 'Кэшбэк по карте' },
  { categoryId: 4, day: 14, amount: 10000, comment: 'Подарок на день рождения', months: [3] },
  { categoryId: 8, day: 3, amount: 32000, comment: 'Аренда квартиры' },
  { categoryId: 8, day: 12, amount: 5400, comment: 'Коммунальные платежи' },
  { categoryId: 7, day: 1, amount: 2900, comment: 'Проездной на месяц' },
  { categoryId: 7, day: 19, amount: 720, comment: 'Такси' },
  { categoryId: 13, day: 10, amount: 890, comment: 'Мобильная связь и интернет' },
  { categoryId: 5, day: 2, amount: 4800, comment: 'Супермаркет' },
  { categoryId: 5, day: 9, amount: 5600, comment: 'Продукты на неделю' },
  { categoryId: 5, day: 16, amount: 6100, comment: 'Супермаркет' },
  { categoryId: 5, day: 23, amount: 4300, comment: 'Рынок' },
  { categoryId: 6, day: 7, amount: 1850, comment: 'Обед с коллегами' },
  { categoryId: 6, day: 13, amount: 3400, comment: 'Ужин в ресторане' },
  { categoryId: 6, day: 20, amount: 2600, comment: 'Кофейня и доставка', months: [1, 3, 5] },
  { categoryId: 10, day: 15, amount: 2400, comment: 'Кино и подписки' },
  { categoryId: 9, day: 11, amount: 3200, comment: 'Аптека и анализы', months: [0, 2, 3, 5] },
  { categoryId: 11, day: 17, amount: 7900, comment: 'Кроссовки', months: [1, 4] },
  { categoryId: 12, day: 8, amount: 4500, comment: 'Онлайн-курс по TypeScript', months: [2, 5] },
]

const vary = (amount: number, seed: number) => {
  const factor = 1 + (((seed * 7919) % 17) - 8) / 100
  return Math.round((amount * factor) / 10) * 10
}

const pad = (day: number) => String(day).padStart(2, '0')

export const mockTransactions: (TransactionInput & { id: number })[] = MONTHS.flatMap((month, monthIndex) =>
  templates
    .filter((t) => !t.months || t.months.includes(monthIndex))
    .map((t, templateIndex) => ({
      categoryId: t.categoryId,
      date: `${month}-${pad(t.day)}`,
      amount: t.categoryId === SALARY ? t.amount + (monthIndex >= 3 ? 7000 : 0) : vary(t.amount, monthIndex * 31 + templateIndex),
      comment: t.comment,
    })),
)
  .filter((t) => t.date <= LAST_DATE)
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((t, index) => ({ ...t, id: index + 1 }))
