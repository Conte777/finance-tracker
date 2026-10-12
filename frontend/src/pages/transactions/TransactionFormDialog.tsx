import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { Category } from '@/entities/category'
import type { Transaction, TransactionType } from '@/entities/transaction'

type TransactionFormDialogProps = {
  open: boolean
  transaction: Transaction | null
  categories: Category[]
  onClose: () => void
}

export function TransactionFormDialog({ open, transaction, categories, onClose }: TransactionFormDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="xs">
      <DialogTitle>{transaction ? 'Редактирование операции' : 'Новая операция'}</DialogTitle>
      <TransactionForm key={transaction?.id ?? 'new'} transaction={transaction} categories={categories} />
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={onClose}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function TransactionForm({ transaction, categories: allCategories }: { transaction: Transaction | null; categories: Category[] }) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [categoryId, setCategoryId] = useState<number | ''>(transaction?.categoryId ?? '')
  const categories = allCategories.filter((c) => c.type === type)

  const changeType = (next: TransactionType | null) => {
    if (!next) return
    setType(next)
    setCategoryId('')
  }

  return (
    <DialogContent>
      <Stack spacing={2.5} sx={{ pt: 1 }}>
        <ToggleButtonGroup exclusive fullWidth color="primary" value={type} onChange={(_, next) => changeType(next)}>
          <ToggleButton value="expense">Расход</ToggleButton>
          <ToggleButton value="income">Доход</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label="Сумма"
          type="number"
          defaultValue={transaction?.amount ?? ''}
          required
          slotProps={{ input: { endAdornment: <InputAdornment position="end">₽</InputAdornment> } }}
        />
        <TextField select label="Категория" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Дата"
          type="date"
          defaultValue={transaction?.date ?? '2026-09-21'}
          required
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField label="Комментарий" defaultValue={transaction?.comment ?? ''} multiline minRows={2} />
      </Stack>
    </DialogContent>
  )
}
