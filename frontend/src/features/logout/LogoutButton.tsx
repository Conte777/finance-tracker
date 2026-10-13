import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout, sessionKeys } from '@/entities/session'

export function LogoutButton() {
  const queryClient = useQueryClient()
  const exit = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.setQueryData(sessionKeys.all, null)
      queryClient.removeQueries({ predicate: ({ queryKey }) => queryKey[0] !== sessionKeys.all[0] })
    },
  })

  return (
    <Tooltip title="Выйти">
      <IconButton aria-label="Выйти" loading={exit.isPending} onClick={() => exit.mutate()}>
        <LogoutOutlinedIcon />
      </IconButton>
    </Tooltip>
  )
}
