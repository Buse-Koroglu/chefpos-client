import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { revokeRoleAtLocation } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

interface DemoteAdminVariables {
  userId: string
  locationIds: string[]
}

export function useDemoteAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, locationIds }: DemoteAdminVariables) => {
      for (const locationId of locationIds) {
        await revokeRoleAtLocation(userId, 'ADMIN', locationId)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Kullanıcı yöneticilikten çıkarıldı.')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Kullanıcı yöneticilikten çıkarılamadı.'))
    },
  })
}
