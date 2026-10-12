import type { ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

type ConfirmDialogProps = {
  open: boolean
  title: string
  text: ReactNode
  confirmLabel?: string
  pending?: boolean
  error?: string
  onConfirm: () => void
  onClose: () => void
  onExited?: () => void
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = 'Удалить',
  pending = false,
  error,
  onConfirm,
  onClose,
  onExited,
}: ConfirmDialogProps) {
  const close = () => {
    if (!pending) onClose()
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs" slotProps={{ transition: { onExited } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close} disabled={pending}>
          Отмена
        </Button>
        <Button variant="contained" color="error" loading={pending} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
