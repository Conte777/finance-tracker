import type { FormEvent } from 'react'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Link as RouterLink, useNavigate } from 'react-router'
import { AuthCard } from '@/shared/ui'

export function LoginPage() {
  const navigate = useNavigate()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate('/')
  }

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
      <Stack component="form" spacing={2} onSubmit={submit}>
        <TextField label="Email" type="email" autoComplete="email" required fullWidth />
        <TextField label="Пароль" type="password" autoComplete="current-password" required fullWidth />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Запомнить меня" />
        <Button type="submit" variant="contained" size="large" fullWidth>
          Войти
        </Button>
      </Stack>
    </AuthCard>
  )
}
