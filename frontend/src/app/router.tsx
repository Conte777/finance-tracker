import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/widgets/app-layout'
import { DashboardPage } from '@/pages/dashboard'
import { TransactionsPage } from '@/pages/transactions'
import { CategoriesPage } from '@/pages/categories'
import { BudgetsPage } from '@/pages/budgets'
import { ReportsPage } from '@/pages/reports'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { NotFoundPage } from '@/pages/not-found'
import { GuestOnly, RequireAuth } from './guards'

export const router = createBrowserRouter([
  {
    Component: RequireAuth,
    children: [
      {
        path: '/',
        Component: AppLayout,
        children: [
          { index: true, Component: DashboardPage },
          { path: 'transactions', Component: TransactionsPage },
          { path: 'categories', Component: CategoriesPage },
          { path: 'budgets', Component: BudgetsPage },
          { path: 'reports', Component: ReportsPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
  {
    Component: GuestOnly,
    children: [
      { path: '/login', Component: LoginPage },
      { path: '/register', Component: RegisterPage },
    ],
  },
])
