import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetKeys, deleteBudget, type Budget } from '@/entities/budget'
import { errorMessage } from '@/shared/api'
import { isApiStatus } from '@/shared/lib/form'
import { ConfirmDialog } from '@/shared/ui'

type DeleteBudgetDialogProps = {
  open: boolean
  budget: Budget | null
  categoryName: string
  onClose: () => void
}

export function DeleteBudgetDialog({ open, budget, categoryName, onClose }: DeleteBudgetDialogProps) {
  const queryClient = useQueryClient()
  const remove = useMutation({
    mutationFn: deleteBudget,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: budgetKeys.all })
      onClose()
    },
    onError: (error) => {
      if (isApiStatus(error, 404)) void queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    },
  })

  return (
    <ConfirmDialog
      open={open}
      title="Удалить бюджет?"
      text={`Лимит для категории «${categoryName}» будет удалён. Операции останутся.`}
      pending={remove.isPending}
      error={remove.isError ? errorMessage(remove.error) : undefined}
      onConfirm={() => budget && remove.mutate(budget.id)}
      onClose={onClose}
      onExited={remove.reset}
    />
  )
}
