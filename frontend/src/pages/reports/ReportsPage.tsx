import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { useQuery } from '@tanstack/react-query'
import { categoriesQuery, indexCategories, type Category } from '@/entities/category'
import {
  ALL_TRANSACTIONS,
  CURRENT_MONTH,
  isInMonth,
  sumAmount,
  sumByCategory,
  transactionsQuery,
  type Transaction,
} from '@/entities/transaction'
import { formatMonth, formatMonthYear, formatRub } from '@/shared/lib/format'
import { PageHeader, QueryState } from '@/shared/ui'

const rubFormatter = (value: number | null) => (value === null ? '' : formatRub(value))

export function ReportsPage() {
  const categories = useQuery(categoriesQuery())
  const transactions = useQuery(transactionsQuery({ size: ALL_TRANSACTIONS }))
  const [selectedMonth, setMonth] = useState<string | null>(null)
  const [exportNotice, setExportNotice] = useState(false)

  const months = [
    ...new Set([CURRENT_MONTH, ...(transactions.data?.items ?? []).map((t) => t.date.slice(0, 7))]),
  ].sort()
  const month = selectedMonth ?? months[months.length - 1]

  return (
    <>
      <PageHeader
        title="Отчёты"
        subtitle="Структура расходов и динамика по месяцам"
        action={
          <Stack direction="row" spacing={1.5}>
            <TextField select size="small" label="Месяц" value={month} onChange={(e) => setMonth(e.target.value)} sx={{ minWidth: 180 }}>
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {formatMonthYear(m)}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={() => setExportNotice(true)}>
              Экспорт CSV
            </Button>
          </Stack>
        }
      />

      <QueryState queries={[categories, transactions]}>
        {categories.data && transactions.data && (
          <ReportsContent categories={categories.data} transactions={transactions.data.items} months={months} month={month} />
        )}
      </QueryState>

      <Snackbar
        open={exportNotice}
        autoHideDuration={4000}
        onClose={() => setExportNotice(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setExportNotice(false)}>
          Экспорт в CSV появится после подключения backend
        </Alert>
      </Snackbar>
    </>
  )
}

type ReportsContentProps = {
  categories: Category[]
  transactions: Transaction[]
  months: string[]
  month: string
}

function ReportsContent({ categories, transactions, months, month }: ReportsContentProps) {
  const categoryById = indexCategories(categories)
  const expensesByCategory = [...sumByCategory(transactions.filter((t) => t.type === 'expense' && isInMonth(t, month)))]
    .sort((a, b) => b[1] - a[1])
    .map(([categoryId, value]) => {
      const category = categoryById.get(categoryId)!
      return { id: categoryId, value, label: category.name, color: category.color }
    })

  const monthly = months.map((m) => {
    const inMonth = transactions.filter((t) => isInMonth(t, m))
    return { month: m, income: sumAmount(inMonth, 'income'), expense: sumAmount(inMonth, 'expense') }
  })

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 5 }}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Расходы по категориям" subheader={formatMonthYear(month)} />
          <CardContent>
            <PieChart
              height={300}
              series={[
                {
                  data: expensesByCategory,
                  innerRadius: 60,
                  paddingAngle: 1,
                  cornerRadius: 4,
                  valueFormatter: (item) => formatRub(item.value),
                },
              ]}
              slotProps={{ legend: { direction: 'vertical', position: { vertical: 'middle', horizontal: 'end' } } }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Доходы и расходы по месяцам" subheader={`${formatMonthYear(months[0])} — ${formatMonthYear(months[months.length - 1])}`} />
          <CardContent>
            <BarChart
              height={300}
              dataset={monthly}
              xAxis={[{ dataKey: 'month', valueFormatter: formatMonth }]}
              yAxis={[{ width: 72, valueFormatter: (value: number) => `${value / 1000} тыс.` }]}
              series={[
                { dataKey: 'income', label: 'Доходы', color: '#43a047', valueFormatter: rubFormatter },
                { dataKey: 'expense', label: 'Расходы', color: '#e53935', valueFormatter: rubFormatter },
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
