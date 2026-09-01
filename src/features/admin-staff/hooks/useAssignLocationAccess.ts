import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignLocationAccess } from '@/shared/api/endpoints/users'
import { updateUserInCache } from '@/features/admin-staff/utils'

export function useAssignLocationAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, locationId }: { userId: string; locationId: string }) =>
      assignLocationAccess(userId, locationId),
    onSuccess: (user) => updateUserInCache(queryClient, user),
  })
}
