import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Link } from 'react-router'
import { CategoryAvatar, categoryById } from '@/entities/category'
import { CURRENT_MONTH, isInMonth, mockTransactions, sumAmount, sumByCategory } from '@/entities/transaction'
import { formatDate, formatMonthYear, formatRub, formatSignedRub } from '@/shared/lib/format'
import { operationsCount } from '@/shared/lib/plural'
import { PageHeader, StatCard } from '@/shared/ui'

export function DashboardPage() {
  const monthTransactions = mockTransactions.filter((t) => isInMonth(t, CURRENT_MONTH))
  const balance = sumAmount(mockTransactions, 'income') - sumAmount(mockTransactions, 'expense')
  const income = sumAmount(monthTransactions, 'income')
  const expense = sumAmount(monthTransactions, 'expense')
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
  const recent = mockTransactions.slice(0, 6)
  const topExpenses = [...sumByCategory(monthTransactions.filter((t) => t.type === 'expense'))]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <>
      <PageHeader title="Обзор" subtitle={formatMonthYear(CURRENT_MONTH)} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Баланс" value={formatRub(balance)} hint="По всем счетам" icon={<AccountBalanceWalletOutlinedIcon />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Доходы за месяц" value={formatRub(income)} hint={operationsCount(monthTransactions.filter((t) => t.type === 'income').length)} icon={<TrendingUpIcon />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Расходы за месяц" value={formatRub(expense)} hint={operationsCount(monthTransactions.filter((t) => t.type === 'expense').length)} icon={<TrendingDownIcon />} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Норма сбережений" value={`${savingsRate} %`} hint={`Отложено ${formatRub(income - expense)}`} icon={<SavingsOutlinedIcon />} color="info" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Последние операции"
              action={
                <Button component={Link} to="/transactions">
                  Все операции
                </Button>
              }
            />
            <List disablePadding>
              {recent.map((t) => {
                const category = categoryById.get(t.categoryId)!
                return (
                  <ListItem key={t.id} secondaryAction={
                    <Typography sx={{ fontWeight: 500, color: t.type === 'income' ? 'success.main' : 'text.primary' }}>
                      {formatSignedRub(t.amount, t.type === 'income')}
                    </Typography>
                  }>
                    <ListItemAvatar>
                      <CategoryAvatar category={category} />
                    </ListItemAvatar>
                    <ListItemText primary={category.name} secondary={`${formatDate(t.date)} · ${t.comment}`} sx={{ pr: 12 }} />
                  </ListItem>
                )
              })}
            </List>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Крупнейшие расходы месяца" />
            <CardContent>
              <Stack spacing={2.5}>
                {topExpenses.map(([categoryId, amount]) => {
                  const category = categoryById.get(categoryId)!
                  return (
                    <div key={categoryId}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography variant="body2">{category.name}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatRub(amount)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(amount / expense) * 100}
                        sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: category.color } }}
                        color="inherit"
                      />
                    </div>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
