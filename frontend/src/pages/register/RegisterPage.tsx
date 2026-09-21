import type { FormEvent } from 'react'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Link as RouterLink, useNavigate } from 'react-router'
import { AuthCard } from '@/shared/ui'

export function RegisterPage() {
  const navigate = useNavigate()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate('/')
  }

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
      <Stack component="form" spacing={2} onSubmit={submit}>
        <TextField label="Имя" autoComplete="name" required fullWidth />
        <TextField label="Email" type="email" autoComplete="email" required fullWidth />
        <TextField label="Пароль" type="password" autoComplete="new-password" helperText="Не менее 8 символов" required fullWidth />
        <TextField label="Повторите пароль" type="password" autoComplete="new-password" required fullWidth />
        <Button type="submit" variant="contained" size="large" fullWidth>
          Создать аккаунт
        </Button>
      </Stack>
    </AuthCard>
  )
}
