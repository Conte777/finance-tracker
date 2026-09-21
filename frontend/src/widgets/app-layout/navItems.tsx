import type { ReactElement } from 'react'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'

type NavItem = {
  to: string
  label: string
  icon: ReactElement
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Обзор', icon: <DashboardOutlinedIcon /> },
  { to: '/transactions', label: 'Операции', icon: <ReceiptLongOutlinedIcon /> },
  { to: '/categories', label: 'Категории', icon: <CategoryOutlinedIcon /> },
  { to: '/budgets', label: 'Бюджеты', icon: <SavingsOutlinedIcon /> },
  { to: '/reports', label: 'Отчёты', icon: <InsertChartOutlinedIcon /> },
]
