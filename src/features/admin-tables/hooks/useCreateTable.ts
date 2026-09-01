import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTable } from '@/shared/api/endpoints/tables'
import type { CreateTableRequest } from '@/shared/types/table'

export function useCreateTable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTableRequest) => createTable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'], exact: false })
      toast.success('Masa başarıyla eklendi.')
    },
  })
}
