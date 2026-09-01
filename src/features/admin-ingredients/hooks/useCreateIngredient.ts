import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createIngredient } from '@/shared/api/endpoints/ingredients'

export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'], exact: false })
      toast.success('Ham madde başarıyla eklendi.')
    },
  })
}
