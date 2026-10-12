import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { budgetKeys, budgetsQuery, createBudget, updateBudget, type Budget, type BudgetInput } from '@/entities/budget'
import { categoriesQuery } from '@/entities/category'
import { ApiError, errorMessage } from '@/shared/api'
import { FormDialog } from '@/shared/ui'
import { budgetFormSchema, type BudgetFormResult, type BudgetFormValues } from './schema'

type BudgetFormDialogProps = {
  open: boolean
  budget: Budget | null
  onClose: () => void
}

export function BudgetFormDialog({ open, budget, onClose }: BudgetFormDialogProps) {
  return (
    <FormDialog open={open} title={budget ? 'Изменение лимита' : 'Новый бюджет'} onClose={onClose}>
      <BudgetForm key={budget?.id ?? 'new'} budget={budget} onDone={onClose} />
    </FormDialog>
  )
}

type BudgetFormProps = {
  budget: Budget | null
  onDone: () => void
}

function BudgetForm({ budget, onDone }: BudgetFormProps) {
  const queryClient = useQueryClient()
  const { data: categories = [] } = useQuery(categoriesQuery())
  const { data: budgets = [] } = useQuery(budgetsQuery())
  const { control, handleSubmit, setError } = useForm<BudgetFormValues, unknown, BudgetFormResult>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: budget ? String(budget.categoryId) : '',
      limit: budget ? String(budget.limit) : '',
    },
  })

  const save = useMutation({
    mutationFn: (data: BudgetInput) => (budget ? updateBudget(budget.id, { limit: data.limit }) : createBudget(data)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: budgetKeys.all })
      onDone()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        setError('categoryId', { message: 'У этой категории уже есть бюджет' })
      } else if (error instanceof ApiError && error.status === 422) {
        setError('categoryId', { message: 'Бюджет можно задать только для расходной категории' })
      }
    },
  })

  const selectedId = useWatch({ control, name: 'categoryId' })
  const budgeted = new Set(budgets.map((b) => b.categoryId))
  const options = categories.filter(
    (c) => String(c.id) === selectedId || (c.type === 'expense' && !budgeted.has(c.id)),
  )
  const fieldError = save.error instanceof ApiError && (save.error.status === 409 || save.error.status === 422)

  return (
    <Box component="form" noValidate onSubmit={handleSubmit((data) => save.mutate(data))}>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {save.isError && !fieldError && <Alert severity="error">{errorMessage(save.error)}</Alert>}
          <Controller
            control={control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Категория"
                required
                disabled={!!budget}
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ??
                  (!budget && options.length === 0 ? 'У всех расходных категорий уже есть бюджет' : undefined)
                }
              >
                {options.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="limit"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Лимит в месяц"
                required
                autoFocus={!!budget}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  htmlInput: { inputMode: 'decimal' },
                  input: { endAdornment: <InputAdornment position="end">₽</InputAdornment> },
                }}
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
