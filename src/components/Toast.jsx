export default function Toast({ toast, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+96px)] z-40 flex justify-center px-4 lg:bottom-8"
    >
      {toast && (
        <div
          key={toast.key}
          className={`animate-toast pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 text-sm font-medium text-bg shadow-[0_12px_32px_-8px_rgb(0_0_0/0.35)] ${toast.action ? 'pr-2 pl-5' : 'px-5 py-3'}`}
        >
          {toast.message}
          {toast.action && (
            <button
              className="rounded-full bg-bg px-3.5 py-1.5 text-[13px] font-semibold text-ink"
              onClick={() => {
                toast.action.onClick()
                onDismiss()
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
