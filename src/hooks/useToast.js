import { useCallback, useEffect, useRef, useState } from 'react'

/** One toast at a time. Pass `action` ({ label, onClick }) for things like Undo. */
export function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef()

  const dismissToast = useCallback(() => {
    clearTimeout(timer.current)
    setToast(null)
  }, [])

  const showToast = useCallback((message, action) => {
    clearTimeout(timer.current)
    setToast({ message, action, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), action ? 5000 : 2200)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])
  return { toast, showToast, dismissToast }
}
