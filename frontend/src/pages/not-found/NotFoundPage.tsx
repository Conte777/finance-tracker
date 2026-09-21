import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link, useLocation } from 'react-router'

export function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', py: { xs: 8, md: 12 } }}>
      <Typography variant="h1" component="p" sx={{ fontWeight: 700, color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h5" component="h1">
        Страница не найдена
      </Typography>
      <Typography sx={{ color: 'text.secondary', maxWidth: 420 }}>
        По адресу <code>{pathname}</code> ничего нет. Проверьте ссылку или вернитесь на главную.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        На главную
      </Button>
    </Stack>
  )
}
