import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { grantRoleAtLocation } from '@/shared/api/endpoints/users'

interface PromoteToAdminVariables {
  userId: string
  locationId: string
}

export function usePromoteToAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, locationId }: PromoteToAdminVariables) => grantRoleAtLocation(userId, 'ADMIN', locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success('Kullanıcı yönetici olarak atandı.')
    },
  })
}
