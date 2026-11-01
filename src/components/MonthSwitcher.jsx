import { formatMonth, monthKey, shiftMonth } from '../utils/format.js'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

export default function MonthSwitcher({ month, onChange }) {
  const current = monthKey()
  const atCurrent = month >= current

  return (
    <div className="flex items-center" data-tour="month">
      <button className="btn-icon" onClick={() => onChange(shiftMonth(month, -1))} aria-label="Previous month">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="min-w-[8.75rem] rounded-full px-1 py-1.5 text-center text-[15px] font-semibold tracking-tight"
        onClick={() => onChange(current)}
        disabled={atCurrent}
        title={atCurrent ? undefined : 'Jump to this month'}
        aria-live="polite"
      >
        {formatMonth(month)}
      </button>
      <button className="btn-icon" onClick={() => onChange(shiftMonth(month, 1))} disabled={atCurrent} aria-label="Next month">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
