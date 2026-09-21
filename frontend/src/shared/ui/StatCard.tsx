import type { ReactNode } from 'react'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type StatCardProps = {
  label: string
  value: string
  hint?: string
  icon: ReactNode
  color: 'primary' | 'success' | 'error' | 'warning' | 'info'
}

export function StatCard({ label, value, hint, icon, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: `${color}.main`, color: `${color}.contrastText` }}>{icon}</Avatar>
          <div>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {label}
            </Typography>
            <Typography variant="h5" component="p">
              {value}
            </Typography>
          </div>
        </Stack>
        {hint && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
            {hint}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
