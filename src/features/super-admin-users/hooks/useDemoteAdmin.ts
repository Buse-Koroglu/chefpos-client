import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removeRole } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

export function useDemoteAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => removeRole(userId, 'ADMIN'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Kullanıcı yöneticilik indirildi.')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Kullanıcı yöneticilik indirilemedi.'))
    },
  })
}
