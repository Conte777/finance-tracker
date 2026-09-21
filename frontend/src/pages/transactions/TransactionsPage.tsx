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
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { CategoryAvatar, categoryById, mockCategories } from '@/entities/category'
import { mockTransactions, type Transaction, type TransactionType } from '@/entities/transaction'
import { formatShortDate, formatSignedRub } from '@/shared/lib/format'
import { operationsCount } from '@/shared/lib/plural'
import { PageHeader } from '@/shared/ui'
import { TransactionFormDialog } from './TransactionFormDialog'

type TypeFilter = TransactionType | 'all'

const ROWS_PER_PAGE = 10

export function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const query = search.trim().toLowerCase()
  const filtered = mockTransactions.filter(
    (t) =>
      (typeFilter === 'all' || t.type === typeFilter) &&
      (categoryFilter === 'all' || t.categoryId === categoryFilter) &&
      (!query || t.comment.toLowerCase().includes(query)),
  )
  const rows = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE)
  const categoryOptions = mockCategories.filter((c) => typeFilter === 'all' || c.type === typeFilter)

  const openDialog = (transaction: Transaction | null) => {
    setEditing(transaction)
    setDialogOpen(true)
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
        subtitle={`Найдено: ${operationsCount(filtered.length)}`}
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
              setCategoryFilter(e.target.value)
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
                        <IconButton size="small">
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
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
        />
      </Card>

      <TransactionFormDialog open={dialogOpen} transaction={editing} onClose={() => setDialogOpen(false)} />
    </>
  )
}
