export function isTableOccupiedConflict(message: string): boolean {
  return message.includes('ödemesi alınmadan')
}
