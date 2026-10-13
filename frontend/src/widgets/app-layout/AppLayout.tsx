import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router'
import { sessionQuery, userInitials } from '@/entities/session'
import { LogoutButton } from '@/features/logout'
import { NavMenu } from './NavMenu'
import { ThemeToggle } from './ThemeToggle'

const DRAWER_WIDTH = 248

function Brand() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 2.5, height: 64 }}>
      <AccountBalanceWalletOutlinedIcon color="primary" />
      <Typography variant="h6" component="span">
        Финучёт
      </Typography>
    </Stack>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: user } = useQuery(sessionQuery())
  const closeMobile = () => setMobileOpen(false)

  const drawerContent = (
    <>
      <Brand />
      <Divider />
      <Box sx={{ pt: 1.5 }}>
        <NavMenu onNavigate={closeMobile} />
      </Box>
    </>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="Открыть меню"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="span" sx={{ display: { md: 'none' } }}>
            Финучёт
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <ThemeToggle />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', ml: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              {user && userInitials(user.name)}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <LogoutButton />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, minWidth: 0, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1280, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
