import type { ReactElement, ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Fade from '@mui/material/Fade'
import Slide from '@mui/material/Slide'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { TransitionProps } from '@mui/material/transitions'

type FormDialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

function SlideUp(props: TransitionProps & { children: ReactElement }) {
  return <Slide direction="up" {...props} />
}

export function FormDialog({ open, title, onClose, children }: FormDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
      slots={{ transition: fullScreen ? SlideUp : Fade }}
    >
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  )
}
