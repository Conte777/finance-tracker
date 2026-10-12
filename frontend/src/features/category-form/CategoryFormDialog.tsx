import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import TextField from '@mui/material/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import {
  CategoryAvatar,
  categoryColors,
  categoryIconKeys,
  categoryKeys,
  createCategory,
  updateCategory,
  type Category,
  type CategoryInput,
} from '@/entities/category'
import { ApiError, errorMessage } from '@/shared/api'
import { FormDialog } from '@/shared/ui'
import { categoryFormSchema, type CategoryFormValues } from './schema'

type CategoryFormDialogProps = {
  open: boolean
  category: Category | null
  onClose: () => void
}

export function CategoryFormDialog({ open, category, onClose }: CategoryFormDialogProps) {
  return (
    <FormDialog open={open} title={category ? 'Редактирование категории' : 'Новая категория'} onClose={onClose}>
      <CategoryForm key={category?.id ?? 'new'} category={category} onDone={onClose} />
    </FormDialog>
  )
}

type CategoryFormProps = {
  category: Category | null
  onDone: () => void
}

const typeChangeMessage = (detail: string) =>
  detail.includes('budget')
    ? 'Нельзя сменить тип: у категории есть бюджет. Сначала удалите его.'
    : 'Нельзя сменить тип: у категории есть операции.'

function CategoryForm({ category, onDone }: CategoryFormProps) {
  const queryClient = useQueryClient()
  const { control, handleSubmit, watch, setError } = useForm<CategoryFormValues, unknown, CategoryInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? '',
      type: category?.type ?? 'expense',
      color: category?.color ?? categoryColors[0],
      icon: category?.icon ?? categoryIconKeys[0],
    },
  })

  const save = useMutation({
    mutationFn: (data: CategoryInput) => (category ? updateCategory(category.id, data) : createCategory(data)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      onDone()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409 && error.detail.includes('already exists')) {
        setError('name', { message: 'Категория с таким названием уже есть' })
      }
    },
  })

  const nameTaken = save.error instanceof ApiError && save.error.status === 409 && save.error.detail.includes('already exists')
  const formError = save.isError && !nameTaken
    ? save.error instanceof ApiError && save.error.status === 409
      ? typeChangeMessage(save.error.detail)
      : errorMessage(save.error)
    : null

  const color = watch('color')

  return (
    <Box component="form" noValidate onSubmit={handleSubmit((data) => save.mutate(data))}>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                fullWidth
                color="primary"
                value={field.value}
                onChange={(_, next) => next && field.onChange(next)}
              >
                <ToggleButton value="expense">Расходы</ToggleButton>
                <ToggleButton value="income">Доходы</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Название"
                required
                autoFocus
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="color"
            render={({ field, fieldState }) => (
              <div>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Цвет
                </FormLabel>
                <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {categoryColors.map((option) => (
                    <ButtonBase
                      key={option}
                      aria-label={option}
                      aria-pressed={field.value === option}
                      onClick={() => field.onChange(option)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: option,
                        outline: field.value === option ? '3px solid' : 'none',
                        outlineColor: 'primary.main',
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </Stack>
                {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
              </div>
            )}
          />
          <Controller
            control={control}
            name="icon"
            render={({ field, fieldState }) => (
              <div>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Иконка
                </FormLabel>
                <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {categoryIconKeys.map((icon) => (
                    <ButtonBase
                      key={icon}
                      aria-label={icon}
                      aria-pressed={field.value === icon}
                      onClick={() => field.onChange(icon)}
                      sx={{
                        borderRadius: '50%',
                        opacity: field.value === icon ? 1 : 0.45,
                        outline: field.value === icon ? '3px solid' : 'none',
                        outlineColor: 'primary.main',
                        outlineOffset: 2,
                      }}
                    >
                      <CategoryAvatar category={{ color, icon }} size={36} />
                    </ButtonBase>
                  ))}
                </Stack>
                {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
              </div>
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
