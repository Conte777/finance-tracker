import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router'
import { z } from 'zod'
import { AuthCard } from '@/shared/ui'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Введите email').pipe(z.email('Неверный формат email')),
  password: z.string().min(8, 'Не менее 8 символов'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

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
      <Stack component="form" spacing={2} noValidate onSubmit={handleSubmit(() => navigate('/'))}>
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
        <FormControlLabel control={<Checkbox defaultChecked />} label="Запомнить меня" />
        <Button type="submit" variant="contained" size="large" fullWidth>
          Войти
        </Button>
      </Stack>
    </AuthCard>
  )
}
