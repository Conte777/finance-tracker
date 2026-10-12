import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { TransitionGroup } from 'react-transition-group'
import { CategoryAvatar, type Category } from '@/entities/category'
import type { Transaction } from '@/entities/transaction'
import { formatShortDate, formatSignedRub } from '@/shared/lib/format'

type TransactionListProps = {
  transactions: Transaction[]
  categoryById: Map<number, Category>
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionList({ transactions, categoryById, onEdit, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>Операции не найдены</Typography>
    )
  }

  return (
    <List disablePadding>
      <TransitionGroup>
        {transactions.map((t) => {
          const category = categoryById.get(t.categoryId)!
          return (
            <Collapse key={t.id}>
              <ListItem
                divider
                disablePadding
                secondaryAction={
                  <IconButton edge="end" size="small" aria-label="Удалить" onClick={() => onDelete(t)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => onEdit(t)}>
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
              </ListItem>
            </Collapse>
          )
        })}
      </TransitionGroup>
    </List>
  )
}
