import { useMutation } from '@tanstack/react-query'
import { makeKioskOrderPaid } from '@/shared/api/endpoints/orders'

export function useMakeKioskOrderPaid() {
  return useMutation({ mutationFn: makeKioskOrderPaid })
}
