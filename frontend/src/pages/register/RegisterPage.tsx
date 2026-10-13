import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'
import { z } from 'zod'
import { register, sessionKeys } from '@/entities/session'
import { ApiError, errorMessage } from '@/shared/api'
import { AuthCard } from '@/shared/ui'

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Введите имя').max(50, 'Не больше 50 символов'),
    email: z.string().trim().min(1, 'Введите email').pipe(z.email('Неверный формат email')),
    password: z.string().min(8, 'Не менее 8 символов').max(128, 'Не больше 128 символов'),
    confirm: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.confirm, {
    path: ['confirm'],
    error: 'Пароли не совпадают',
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const queryClient = useQueryClient()
  const { control, handleSubmit, setError } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  })

  const signUp = useMutation({
    mutationFn: register,
    onSuccess: (user) => queryClient.setQueryData(sessionKeys.all, user),
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        setError('email', { message: 'Этот email уже зарегистрирован' })
      }
    },
  })

  const emailTaken = signUp.error instanceof ApiError && signUp.error.status === 409
  const formError = signUp.isError && !emailTaken ? errorMessage(signUp.error) : null

  return (
    <AuthCard
      title="Регистрация"
      subtitle="Создайте аккаунт, чтобы вести личный бюджет"
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} to="/login">
            Войти
          </Link>
        </>
      }
    >
      <Stack
        component="form"
        spacing={2}
        noValidate
        onSubmit={handleSubmit(({ name, email, password }) => signUp.mutate({ name, email, password }))}
      >
        {formError && <Alert severity="error">{formError}</Alert>}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Имя"
              autoComplete="name"
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Пароль"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Не менее 8 символов'}
            />
          )}
        />
        <Controller
          control={control}
          name="confirm"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Повторите пароль"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" size="large" fullWidth loading={signUp.isPending}>
          Создать аккаунт
        </Button>
      </Stack>
    </AuthCard>
  )
}
