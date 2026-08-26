import { useMutation } from '@tanstack/react-query'
import { createKioskOrder } from '@/shared/api/endpoints/orders'

export function useCreateKioskOrder() {
  return useMutation({ mutationFn: createKioskOrder })
}
