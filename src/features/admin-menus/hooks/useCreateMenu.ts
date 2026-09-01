import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMenu } from '@/shared/api/endpoints/menus'
import type { CreateMenuRequest } from '@/shared/types/menu'

export function useCreateMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMenuRequest) => createMenu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'], exact: false })
      toast.success('Menü başarıyla oluşturuldu.')
    },
  })
}
