import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface InfoDialogProps {
  open: boolean
  title: string
  message: string
  onClose: () => void
}

export function InfoDialog({ open, title, message, onClose }: InfoDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              <AlertTriangle className="size-4 text-amber-500" />
              {title}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 transition-colors hover:text-zinc-700"
              aria-label="Kapat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-5 py-5">
            <p className="text-sm leading-6 text-zinc-700">{message}</p>
          </div>

          <div className="flex border-t border-zinc-200 p-4">
            <Button
              type="button"
              className="h-11 w-full rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
              onClick={onClose}
            >
              Tamam
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
