import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { categoriesQuery } from '@/entities/category'
import {
  createTransaction,
  transactionKeys,
  updateTransaction,
  type Transaction,
  type TransactionInput,
} from '@/entities/transaction'
import { ApiError, errorMessage } from '@/shared/api'
import { FormDialog } from '@/shared/ui'
import { DEFAULT_DATE, transactionFormSchema, type TransactionFormResult, type TransactionFormValues } from './schema'

type TransactionFormDialogProps = {
  open: boolean
  transaction: Transaction | null
  onClose: () => void
}

export function TransactionFormDialog({ open, transaction, onClose }: TransactionFormDialogProps) {
  return (
    <FormDialog open={open} title={transaction ? 'Редактирование операции' : 'Новая операция'} onClose={onClose}>
      <TransactionForm key={transaction?.id ?? 'new'} transaction={transaction} onDone={onClose} />
    </FormDialog>
  )
}

type TransactionFormProps = {
  transaction: Transaction | null
  onDone: () => void
}

function TransactionForm({ transaction, onDone }: TransactionFormProps) {
  const queryClient = useQueryClient()
  const { data: allCategories = [] } = useQuery(categoriesQuery())
  const { control, handleSubmit, watch, setValue, setError } = useForm<TransactionFormValues, unknown, TransactionFormResult>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: transaction?.type ?? 'expense',
      amount: transaction ? String(transaction.amount) : '',
      categoryId: transaction ? String(transaction.categoryId) : '',
      date: transaction?.date ?? DEFAULT_DATE,
      comment: transaction?.comment ?? '',
    },
  })

  const save = useMutation({
    mutationFn: (data: TransactionInput) =>
      transaction ? updateTransaction(transaction.id, data) : createTransaction(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      onDone()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 422) {
        setError('categoryId', { message: 'Категория не найдена, выберите другую' })
      }
    },
  })

  const type = watch('type')
  const categories = allCategories.filter((c) => c.type === type)

  const submit = handleSubmit(({ amount, categoryId, date, comment }) =>
    save.mutate({ amount, categoryId, date, comment: comment.trim() }),
  )

  return (
    <Box component="form" noValidate onSubmit={submit}>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {save.isError && !(save.error instanceof ApiError && save.error.status === 422) && (
            <Alert severity="error">{errorMessage(save.error)}</Alert>
          )}
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                fullWidth
                color="primary"
                value={field.value}
                onChange={(_, next) => {
                  if (!next) return
                  field.onChange(next)
                  setValue('categoryId', '')
                }}
              >
                <ToggleButton value="expense">Расход</ToggleButton>
                <ToggleButton value="income">Доход</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
          <Controller
            control={control}
            name="amount"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Сумма"
                required
                autoFocus
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  htmlInput: { inputMode: 'decimal' },
                  input: { endAdornment: <InputAdornment position="end">₽</InputAdornment> },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Категория"
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="date"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Дата"
                type="date"
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
          <Controller
            control={control}
            name="comment"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Комментарий"
                multiline
                minRows={2}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? `${field.value.length} / 200`}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onDone} disabled={save.isPending}>
          Отмена
        </Button>
        <Button type="submit" variant="contained" loading={save.isPending}>
          Сохранить
        </Button>
      </DialogActions>
    </Box>
  )
}
