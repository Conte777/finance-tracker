import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { TransitionGroup } from 'react-transition-group'
import { CategoryAvatar, categoriesQuery, categoryTypeLabels, type Category, type CategoryType } from '@/entities/category'
import { CategoryFormDialog } from '@/features/category-form'
import { DeleteCategoryDialog } from '@/features/delete-category'
import { ALL_TRANSACTIONS, transactionsQuery, type Transaction } from '@/entities/transaction'
import { operationsCount } from '@/shared/lib/plural'
import { PageHeader, QueryState } from '@/shared/ui'

const categoryTypes: CategoryType[] = ['expense', 'income']

export function CategoriesPage() {
  const categories = useQuery(categoriesQuery())
  const transactions = useQuery(transactionsQuery({ size: ALL_TRANSACTIONS }))
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const openForm = (category: Category | null) => {
    setEditing(category)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Категории"
        subtitle="Группы для доходов и расходов"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm(null)}>
            Добавить категорию
          </Button>
        }
      />
      <QueryState queries={[categories, transactions]}>
        {categories.data && transactions.data && (
          <CategoriesContent categories={categories.data} transactions={transactions.data.items} onEdit={openForm} />
        )}
      </QueryState>
      <CategoryFormDialog open={formOpen} category={editing} onClose={() => setFormOpen(false)} />
    </>
  )
}

type CategoriesContentProps = {
  categories: Category[]
  transactions: Transaction[]
  onEdit: (category: Category) => void
}

function CategoriesContent({ categories: allCategories, transactions, onEdit }: CategoriesContentProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const usage = (categoryId: number) => transactions.filter((t) => t.categoryId === categoryId).length

  const openDelete = (category: Category) => {
    setDeleting(category)
    setDeleteOpen(true)
  }

  return (
    <>
      <Grid container spacing={2}>
        {categoryTypes.map((type) => {
          const categories = allCategories.filter((c) => c.type === type)
          return (
            <Grid key={type} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader
                  title={categoryTypeLabels[type]}
                  action={<Chip label={categories.length} color={type === 'income' ? 'success' : 'default'} />}
                />
                {categories.length === 0 && (
                  <Typography sx={{ px: 2, pb: 3, color: 'text.secondary' }}>Категорий пока нет</Typography>
                )}
                <List disablePadding>
                  <TransitionGroup>
                    {categories.map((category) => (
                      <Collapse key={category.id}>
                        <ListItem
                          divider
                          secondaryAction={
                            <>
                              <Tooltip title="Изменить">
                                <IconButton size="small" onClick={() => onEdit(category)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Удалить">
                                <IconButton size="small" edge="end" onClick={() => openDelete(category)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          }
                        >
                          <ListItemAvatar>
                            <CategoryAvatar category={category} />
                          </ListItemAvatar>
                          <ListItemText primary={category.name} secondary={operationsCount(usage(category.id))} />
                        </ListItem>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </List>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <DeleteCategoryDialog open={deleteOpen} category={deleting} onClose={() => setDeleteOpen(false)} />
    </>
  )
}
