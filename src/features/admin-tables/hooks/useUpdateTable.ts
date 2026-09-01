import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { activateTable, deactivateTable, updateTable } from '@/shared/api/endpoints/tables'

interface UpdateTableVariables {
  id: string
  currentTableNumber: number
  nextTableNumber: number
  currentIsActive: boolean
  nextIsActive: boolean
}

export function useUpdateTable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, currentTableNumber, nextTableNumber, currentIsActive, nextIsActive }: UpdateTableVariables) => {
      if (nextTableNumber !== currentTableNumber) {
        await updateTable(id, { tableNumber: nextTableNumber })
      }
      if (nextIsActive !== currentIsActive) {
        await (nextIsActive ? activateTable(id) : deactivateTable(id))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'], exact: false })
      toast.success('Masa bilgileri güncellendi.')
    },
  })
}
