import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'
import { z } from 'zod'
import { login, sessionKeys } from '@/entities/session'
import { ApiError, errorMessage } from '@/shared/api'
import { AuthCard } from '@/shared/ui'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Введите email').pipe(z.email('Неверный формат email')),
  password: z.string().min(1, 'Введите пароль'),
  remember: z.boolean(),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const queryClient = useQueryClient()
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const signIn = useMutation({
    mutationFn: login,
    onSuccess: (user) => queryClient.setQueryData(sessionKeys.all, user),
  })

  const formError = signIn.isError
    ? signIn.error instanceof ApiError && signIn.error.status === 401
      ? 'Неверный email или пароль'
      : errorMessage(signIn.error)
    : null

  return (
    <AuthCard
      title="Вход"
      subtitle="Войдите, чтобы продолжить учёт финансов"
      footer={
        <>
          Нет аккаунта?{' '}
          <Link component={RouterLink} to="/register">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <Stack component="form" spacing={2} noValidate onSubmit={handleSubmit((values) => signIn.mutate(values))}>
        {formError && <Alert severity="error">{formError}</Alert>}
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
              autoComplete="current-password"
              required
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="remember"
          render={({ field: { value, onChange, ...field } }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={value} onChange={(_, checked) => onChange(checked)} />}
              label="Запомнить меня"
            />
          )}
        />
        <Button type="submit" variant="contained" size="large" fullWidth loading={signIn.isPending}>
          Войти
        </Button>
      </Stack>
    </AuthCard>
  )
}
