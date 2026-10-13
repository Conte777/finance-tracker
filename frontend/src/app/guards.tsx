import Box from '@mui/material/Box'
import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation, type Location } from 'react-router'
import { sessionQuery } from '@/entities/session'
import { QueryState } from '@/shared/ui'

type RedirectState = { from?: Location } | null

export function RequireAuth() {
  const session = useQuery(sessionQuery())
  const location = useLocation()

  if (session.isSuccess && !session.data) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <QueryState queries={[session]}>
      <Outlet />
    </QueryState>
  )
}

export function GuestOnly() {
  const session = useQuery(sessionQuery())
  const location = useLocation()

  if (session.data) {
    return <Navigate to={(location.state as RedirectState)?.from ?? '/'} replace />
  }

  if (session.isPending) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <QueryState queries={[session]}>{null}</QueryState>
      </Box>
    )
  }

  return <Outlet />
}
