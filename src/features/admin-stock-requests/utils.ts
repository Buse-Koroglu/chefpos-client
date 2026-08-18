const dateTimeFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatStockRequestDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso)).replace(',', '')
}
