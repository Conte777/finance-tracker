import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTransaction, transactionKeys, type Transaction } from '@/entities/transaction'
import { errorMessage } from '@/shared/api'
import { formatShortDate, formatSignedRub } from '@/shared/lib/format'
import { isApiStatus } from '@/shared/lib/form'
import { ConfirmDialog } from '@/shared/ui'

type DeleteTransactionDialogProps = {
  open: boolean
  transaction: Transaction | null
  onClose: () => void
}

export function DeleteTransactionDialog({ open, transaction, onClose }: DeleteTransactionDialogProps) {
  const queryClient = useQueryClient()
  const remove = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      onClose()
    },
    onError: (error) => {
      if (isApiStatus(error, 404)) void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })

  return (
    <ConfirmDialog
      open={open}
      title="Удалить операцию?"
      text={
        transaction &&
        `Операция ${formatSignedRub(transaction.amount, transaction.type === 'income')} от ${formatShortDate(transaction.date)} будет удалена без возможности восстановления.`
      }
      pending={remove.isPending}
      error={remove.isError ? errorMessage(remove.error) : undefined}
      onConfirm={() => transaction && remove.mutate(transaction.id)}
      onClose={onClose}
      onExited={remove.reset}
    />
  )
}
