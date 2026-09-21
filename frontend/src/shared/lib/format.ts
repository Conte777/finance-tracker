const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' })

export const formatRub = (amount: number) => rubFormatter.format(amount)

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

export const formatMonth = (iso: string) => monthFormatter.format(new Date(iso))
