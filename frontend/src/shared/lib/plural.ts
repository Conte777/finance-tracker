const rules = new Intl.PluralRules('ru-RU')

export const plural = (count: number, forms: { one: string; few: string; many: string }) => {
  const rule = rules.select(count)
  const form = rule === 'one' ? forms.one : rule === 'few' ? forms.few : forms.many
  return `${count} ${form}`
}

export const operationsCount = (count: number) =>
  plural(count, { one: 'операция', few: 'операции', many: 'операций' })
