export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center px-6 pt-10 pb-12 text-center">
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-line" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 6h24v36l-4-2.5-4 2.5-4-2.5-4 2.5-4-2.5-4 2.5V6Z" strokeLinejoin="round" />
        <path d="M18 16h12M18 23h12M18 30h6" strokeLinecap="round" />
      </svg>
      <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-[260px] text-sm text-muted">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
