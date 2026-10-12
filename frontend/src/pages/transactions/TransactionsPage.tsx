import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DeleteTransactionDialog } from '@/features/delete-transaction'
import { TransactionFormDialog } from '@/features/transaction-form'
import { CategoryAvatar, categoriesQuery, indexCategories } from '@/entities/category'
import { transactionsQuery, type Transaction, type TransactionType } from '@/entities/transaction'
import { formatShortDate, formatSignedRub } from '@/shared/lib/format'
import { operationsCount } from '@/shared/lib/plural'
import { PageHeader, QueryState } from '@/shared/ui'
import { TransactionList } from './TransactionList'

type TypeFilter = TransactionType | 'all'

const ROWS_PER_PAGE = 10

export function TransactionsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const categories = useQuery(categoriesQuery())
  const transactions = useQuery({
    ...transactionsQuery({
      type: typeFilter === 'all' ? undefined : typeFilter,
      categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
      q: search.trim() || undefined,
      page: page + 1,
      size: ROWS_PER_PAGE,
    }),
    placeholderData: keepPreviousData,
  })

  const rows = transactions.data?.items ?? []
  const total = transactions.data?.total ?? 0
  const lastPage = Math.max(0, Math.ceil(total / ROWS_PER_PAGE) - 1)
  if (transactions.data && !transactions.isPlaceholderData && page > lastPage) setPage(lastPage)
  const categoryById = indexCategories(categories.data ?? [])
  const categoryOptions = (categories.data ?? []).filter((c) => typeFilter === 'all' || c.type === typeFilter)

  const openDialog = (transaction: Transaction | null) => {
    setEditing(transaction)
    setDialogOpen(true)
  }

  const openDelete = (transaction: Transaction) => {
    setDeleting(transaction)
    setDeleteOpen(true)
  }

  const changeType = (next: TypeFilter | null) => {
    if (!next) return
    setTypeFilter(next)
    setCategoryFilter('all')
    setPage(0)
  }

  return (
    <>
      <PageHeader
        title="Операции"
        subtitle={transactions.data ? `Найдено: ${operationsCount(total)}` : undefined}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialog(null)}>
            Добавить операцию
          </Button>
        }
      />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2 }}>
          <ToggleButtonGroup exclusive size="small" color="primary" value={typeFilter} onChange={(_, next) => changeType(next)}>
            <ToggleButton value="all">Все</ToggleButton>
            <ToggleButton value="income">Доходы</ToggleButton>
            <ToggleButton value="expense">Расходы</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            select
            size="small"
            label="Категория"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              setPage(0)
            }}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="all">Все категории</MenuItem>
            {categoryOptions.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            placeholder="Поиск по комментарию"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            sx={{ flexGrow: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <QueryState queries={[categories, transactions]}>
          {isMobile ? (
            <TransactionList transactions={rows} categoryById={categoryById} onEdit={openDialog} onDelete={openDelete} />
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Категория</TableCell>
                    <TableCell>Комментарий</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    <TableCell align="right" sx={{ width: 104 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((t) => {
                    const category = categoryById.get(t.categoryId)!
                    return (
                      <TableRow key={t.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatShortDate(t.date)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <CategoryAvatar category={category} size={32} />
                            <span>{category.name}</span>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{t.comment}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Chip
                            size="small"
                            variant="outlined"
                            color={t.type === 'income' ? 'success' : 'default'}
                            label={formatSignedRub(t.amount, t.type === 'income')}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Изменить">
                            <IconButton size="small" onClick={() => openDialog(t)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton size="small" onClick={() => openDelete(t)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                          Операции не найдены
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </QueryState>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
        />
      </Card>

      <TransactionFormDialog open={dialogOpen} transaction={editing} onClose={() => setDialogOpen(false)} />
      <DeleteTransactionDialog open={deleteOpen} transaction={deleting} onClose={() => setDeleteOpen(false)} />
    </>
  )
}
