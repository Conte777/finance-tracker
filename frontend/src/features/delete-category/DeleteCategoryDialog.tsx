import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetKeys } from '@/entities/budget'
import { categoryKeys, deleteCategory, type Category } from '@/entities/category'
import { ApiError, errorMessage } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'

type DeleteCategoryDialogProps = {
  open: boolean
  category: Category | null
  onClose: () => void
}

const deleteErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.status === 409
    ? 'Нельзя удалить: у категории есть операции. Удалите их или перенесите в другую категорию.'
    : errorMessage(error)

export function DeleteCategoryDialog({ open, category, onClose }: DeleteCategoryDialogProps) {
  const queryClient = useQueryClient()
  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
        queryClient.invalidateQueries({ queryKey: budgetKeys.all }),
      ])
      onClose()
    },
  })

  return (
    <ConfirmDialog
      open={open}
      title="Удалить категорию?"
      text={
        category &&
        `Категория «${category.name}» будет удалена.${category.type === 'expense' ? ' Её бюджет тоже удалится.' : ''}`
      }
      pending={remove.isPending}
      error={remove.isError ? deleteErrorMessage(remove.error) : undefined}
      onConfirm={() => category && remove.mutate(category.id)}
      onClose={onClose}
      onExited={remove.reset}
    />
  )
}
