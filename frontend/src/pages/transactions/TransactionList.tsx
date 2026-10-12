import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { CategoryAvatar, type Category } from '@/entities/category'
import type { Transaction } from '@/entities/transaction'
import { formatShortDate, formatSignedRub } from '@/shared/lib/format'

type TransactionListProps = {
  transactions: Transaction[]
  categoryById: Map<number, Category>
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, categoryById, onEdit }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>Операции не найдены</Typography>
    )
  }

  return (
    <List disablePadding>
      {transactions.map((t) => {
        const category = categoryById.get(t.categoryId)!
        return (
          <ListItemButton key={t.id} divider onClick={() => onEdit(t)}>
            <ListItemAvatar>
              <CategoryAvatar category={category} />
            </ListItemAvatar>
            <ListItemText primary={category.name} secondary={`${formatShortDate(t.date)} · ${t.comment}`} />
            <Typography
              sx={{ ml: 1, fontWeight: 500, whiteSpace: 'nowrap', color: t.type === 'income' ? 'success.main' : 'text.primary' }}
            >
              {formatSignedRub(t.amount, t.type === 'income')}
            </Typography>
          </ListItemButton>
        )
      })}
    </List>
  )
}
