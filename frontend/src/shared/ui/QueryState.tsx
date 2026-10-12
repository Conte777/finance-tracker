import type { ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { errorMessage } from '@/shared/api'

type QueryLike = {
  isPending: boolean
  error: unknown
  refetch: () => unknown
}

type QueryStateProps = {
  queries: QueryLike[]
  empty?: boolean
  emptyText?: string
  children: ReactNode
}

export function QueryState({ queries, empty = false, emptyText = 'Данных пока нет', children }: QueryStateProps) {
  const failed = queries.filter((q) => q.error)
  if (failed.length > 0) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => failed.forEach((q) => q.refetch())}>
            Повторить
          </Button>
        }
      >
        {errorMessage(failed[0].error)}
      </Alert>
    )
  }

  if (queries.some((q) => q.isPending)) {
    return (
      <Stack role="status" aria-label="Загрузка" sx={{ alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Fade in>
      <div>
        {empty ? (
          <Typography sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>{emptyText}</Typography>
        ) : (
          children
        )}
      </div>
    </Fade>
  )
}
