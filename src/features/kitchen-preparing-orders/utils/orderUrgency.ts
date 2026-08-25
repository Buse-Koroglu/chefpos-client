import { KITCHEN_URGENCY_THRESHOLDS_MINUTES } from '../constants'

export type OrderUrgency = 'normal' | 'warning' | 'critical'

export function getOrderUrgency(createdAt: string, now: Date): OrderUrgency {
  const elapsedMinutes = (now.getTime() - new Date(createdAt).getTime()) / 60_000

  if (elapsedMinutes >= KITCHEN_URGENCY_THRESHOLDS_MINUTES.critical) {
    return 'critical'
  }
  if (elapsedMinutes >= KITCHEN_URGENCY_THRESHOLDS_MINUTES.warning) {
    return 'warning'
  }
  return 'normal'
}
