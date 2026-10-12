const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const rubKopecksFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' })

const monthYearFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' })

export const formatRub = (amount: number) =>
  (Number.isInteger(Math.round(amount * 100) / 100) ? rubFormatter : rubKopecksFormatter).format(amount)

export const formatSignedRub = (amount: number, isIncome: boolean) =>
  `${isIncome ? '+' : '−'}${formatRub(amount)}`

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

export const formatShortDate = (iso: string) => shortDateFormatter.format(new Date(iso))

export const formatMonth = (month: string) => monthFormatter.format(new Date(`${month}-01`))

export const formatMonthYear = (month: string) => {
  const label = monthYearFormatter.format(new Date(`${month}-01`))
  return label.charAt(0).toUpperCase() + label.slice(1)
}
