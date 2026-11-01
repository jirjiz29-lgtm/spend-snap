import { useEffect, useId, useRef } from 'react'
import { X } from './Icons.jsx'

/**
 * Native <dialog> shown as a bottom sheet on phones and a centred dialog on larger screens.
 * Children mount only while open, so forms start fresh each time.
 */
export default function Sheet({ open, onClose, title, children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && (
        <div className="flex max-h-[inherit] flex-col">
          <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line sm:hidden" aria-hidden="true" />
          <header className="flex shrink-0 items-center justify-between px-5 pt-3 pb-1 sm:pt-5">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">{title}</h2>
            <button className="btn-icon -mr-2" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="overflow-y-auto px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)]">{children}</div>
        </div>
      )}
    </dialog>
  )
}
