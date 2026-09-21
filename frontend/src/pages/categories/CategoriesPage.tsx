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
import { CategoryAvatar, categoryTypeLabels, mockCategories, type CategoryType } from '@/entities/category'
import { mockTransactions } from '@/entities/transaction'
import { operationsCount } from '@/shared/lib/plural'
import { PageHeader } from '@/shared/ui'

const categoryTypes: CategoryType[] = ['expense', 'income']

export function CategoriesPage() {
  const usage = (categoryId: string) => mockTransactions.filter((t) => t.categoryId === categoryId).length

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
      <Grid container spacing={2}>
        {categoryTypes.map((type) => {
          const categories = mockCategories.filter((c) => c.type === type)
          return (
            <Grid key={type} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader
                  title={categoryTypeLabels[type]}
                  action={<Chip label={categories.length} color={type === 'income' ? 'success' : 'default'} />}
                />
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
