import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
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
import { CategoryAvatar, categoriesQuery, categoryTypeLabels, type Category, type CategoryType } from '@/entities/category'
import { ALL_TRANSACTIONS, transactionsQuery, type Transaction } from '@/entities/transaction'
import { operationsCount } from '@/shared/lib/plural'
import { PageHeader, QueryState } from '@/shared/ui'

const categoryTypes: CategoryType[] = ['expense', 'income']

export function CategoriesPage() {
  const categories = useQuery(categoriesQuery())
  const transactions = useQuery(transactionsQuery({ size: ALL_TRANSACTIONS }))

  return (
    <>
      <PageHeader
        title="Категории"
        subtitle="Группы для доходов и расходов"
        action={
          <Button variant="contained" startIcon={<AddIcon />}>
            Добавить категорию
          </Button>
        }
      />
      <QueryState queries={[categories, transactions]}>
        {categories.data && transactions.data && (
          <CategoriesContent categories={categories.data} transactions={transactions.data.items} />
        )}
      </QueryState>
    </>
  )
}

type CategoriesContentProps = {
  categories: Category[]
  transactions: Transaction[]
}

function CategoriesContent({ categories: allCategories, transactions }: CategoriesContentProps) {
  const usage = (categoryId: number) => transactions.filter((t) => t.categoryId === categoryId).length

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
                  {categories.map((category) => (
                    <ListItem
                      key={category.id}
                      divider
                      secondaryAction={
                        <>
                          <Tooltip title="Изменить">
                            <IconButton size="small">
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton size="small" edge="end">
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
                  ))}
                </List>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
