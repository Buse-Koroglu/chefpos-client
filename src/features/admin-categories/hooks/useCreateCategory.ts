import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory } from '@/shared/api/endpoints/categories'
import type { CreateCategoryRequest } from '@/shared/types/category'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], exact: false })
      toast.success('Kategori başarıyla eklendi.')
    },
  })
}
