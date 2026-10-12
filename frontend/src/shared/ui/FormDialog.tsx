import type { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

type FormDialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function FormDialog({ open, title, onClose, children }: FormDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  )
}
