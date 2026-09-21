import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'

type AuthCardProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, bgcolor: 'background.default' }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <AccountBalanceWalletOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="h5" component="span">
              Финучёт
            </Typography>
          </Stack>
          <Typography variant="h6" component="h1" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
            {subtitle}
          </Typography>
          {children}
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
            {footer}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
