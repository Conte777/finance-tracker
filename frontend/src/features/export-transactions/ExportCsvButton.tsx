import Button from '@mui/material/Button'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { indexCategories, type Category } from '@/entities/category'
import { today, type Transaction } from '@/entities/transaction'
import { toCsv } from './toCsv'

type ExportCsvButtonProps = {
  transactions: Transaction[] | undefined
  categories: Category[] | undefined
}

export function ExportCsvButton({ transactions, categories }: ExportCsvButtonProps) {
  const download = () => {
    if (!transactions || !categories) return
    const csv = toCsv(transactions, indexCategories(categories))
    const url = URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `operations-${today()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      disabled={!transactions?.length || !categories}
      onClick={download}
    >
      Экспорт CSV
    </Button>
  )
}
