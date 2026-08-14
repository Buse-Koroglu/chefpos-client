import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      style={
        {
          '--border-radius': '0px',
        } as React.CSSProperties
      }
      toastOptions={{
        className: '!rounded-none border text-sm font-sans shadow-none',
        classNames: {
          toast: '!rounded-none border border-zinc-200 bg-white text-zinc-900 shadow-sm',
          title: 'text-xs font-semibold uppercase tracking-wide',
          description: 'text-xs text-zinc-500',
          actionButton: '!rounded-none bg-[#133458] text-white text-xs px-3 py-1 font-medium hover:bg-[#0f2843] transition-colors',
          cancelButton: '!rounded-none bg-zinc-100 text-zinc-700 text-xs px-3 py-1 font-medium hover:bg-zinc-200 transition-colors',
          closeButton: '!rounded-none !border !border-zinc-200 !bg-white text-zinc-500 hover:!bg-zinc-100 hover:text-zinc-900 transition-colors',
          // Tip bazlı keskin renkler
          success: '!bg-emerald-50 !border-emerald-200 !text-emerald-900',
          error: '!bg-red-50 !border-red-200 !text-red-900',
          warning: '!bg-amber-50 !border-amber-200 !text-amber-900',
          info: '!bg-sky-50 !border-sky-200 !text-sky-900',
        },
      }}
    />
  )
}