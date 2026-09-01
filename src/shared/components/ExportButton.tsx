import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { resolveBlobErrorMessage } from '@/shared/lib/resolveBlobErrorMessage'

interface ExportButtonProps {
  onExport: () => Promise<void>
  label?: string
  disabled?: boolean
  getErrorMessage?: (error: unknown) => string | Promise<string>
}
// Ortak kullanılan export butonu

function defaultErrorMessage(error: unknown): Promise<string> {
  return resolveBlobErrorMessage(error, 'Export sırasında bir hata oluştu. Lütfen tekrar deneyin.')
}

export function ExportButton({ onExport, label = 'Dışarı Aktar', disabled, getErrorMessage = defaultErrorMessage,}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport() {
    if (isExporting || disabled) return
    setIsExporting(true)
    try {
      await onExport()
    } catch (error) {
      toast.error(await getErrorMessage(error))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="flex items-center gap-1.5 border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
      {label}
    </button>
  )
}
