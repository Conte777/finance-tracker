import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { mockBudgets } from '@/entities/budget'
import { CategoryAvatar, categoryById } from '@/entities/category'
import { CURRENT_MONTH, isInMonth, mockTransactions, sumByCategory } from '@/entities/transaction'
import { formatMonthYear, formatRub } from '@/shared/lib/format'
import { PageHeader, StatCard } from '@/shared/ui'

const WARNING_THRESHOLD = 80

const statusOf = (percent: number) => {
  if (percent > 100) return { color: 'error', label: 'Превышен' } as const
  if (percent >= WARNING_THRESHOLD) return { color: 'warning', label: 'Почти исчерпан' } as const
  return { color: 'success', label: 'В пределах' } as const
}

export function BudgetsPage() {
  const spentByCategory = sumByCategory(
    mockTransactions.filter((t) => t.type === 'expense' && isInMonth(t, CURRENT_MONTH)),
  )
  const budgets = mockBudgets.map((budget) => {
    const spent = spentByCategory.get(budget.categoryId) ?? 0
    return { ...budget, spent, percent: Math.round((spent / budget.limit) * 100) }
  })
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const exceeded = budgets.filter((b) => b.percent > 100).length

  return (
    <>
      <PageHeader
        title="Бюджеты"
        subtitle={`Лимиты расходов на ${formatMonthYear(CURRENT_MONTH).toLowerCase()}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />}>
            Добавить бюджет
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Общий лимит" value={formatRub(totalLimit)} icon={<AccountBalanceOutlinedIcon />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Потрачено" value={formatRub(totalSpent)} hint={`${Math.round((totalSpent / totalLimit) * 100)} % от лимита`} icon={<PaymentsOutlinedIcon />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Превышено бюджетов" value={String(exceeded)} icon={<WarningAmberOutlinedIcon />} color={exceeded > 0 ? 'error' : 'success'} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {budgets.map((budget) => {
          const category = categoryById.get(budget.categoryId)!
          const status = statusOf(budget.percent)
          const left = budget.limit - budget.spent
          return (
            <Grid key={budget.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
                    <CategoryAvatar category={category} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, flexGrow: 1 }}>
                      {category.name}
                    </Typography>
                    <Chip size="small" color={status.color} label={status.label} />
                  </Stack>
                  <Typography variant="h6" component="p">
                    {formatRub(budget.spent)}{' '}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                      из {formatRub(budget.limit)}
                    </Typography>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    color={status.color}
                    value={Math.min(budget.percent, 100)}
                    sx={{ height: 8, borderRadius: 4, my: 1.5 }}
                  />
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {budget.percent} %
                    </Typography>
                    <Typography variant="body2" sx={{ color: left < 0 ? 'error.main' : 'text.secondary' }}>
                      {left < 0 ? `Перерасход ${formatRub(-left)}` : `Осталось ${formatRub(left)}`}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
