export function isStockManagerConflict(message: string): boolean {
  return message.includes('Stok Yetkilisi') && message.includes('zaten')
}
