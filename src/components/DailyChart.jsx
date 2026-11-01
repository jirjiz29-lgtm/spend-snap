import { formatMonthShort, monthKey } from '../utils/format.js'
import { getDailySeries } from '../utils/summary.js'

export default function DailyChart({ expenses, month, fmt }) {
  const series = getDailySeries(expenses, month)
  const max = Math.max(0, ...series)
  const peakDay = series.indexOf(max) + 1
  const today = month === monthKey() ? new Date().getDate() : null
  const days = series.length

  return (
    <section className="card p-5" aria-labelledby="daily-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="daily-heading" className="shrink-0 text-[15px] font-semibold tracking-tight">Daily spending</h2>
        {max > 0 && (
          <p className="truncate text-xs text-muted">
            Peak <span className="font-medium text-ink tabular-nums">{fmt(max)}</span> · {peakDay} {formatMonthShort(month)}
          </p>
        )}
      </div>

      <div className="mt-5 flex h-28 items-end gap-[3px]" role="img" aria-label={`Spending per day, highest ${fmt(max)} on day ${peakDay}`}>
        {series.map((amount, i) => {
          const day = i + 1
          const future = today !== null && day > today
          const height = amount ? `${Math.max((amount / max) * 100, 6)}%` : '3px'
          const color = amount ? (day === today ? 'bg-accent' : day === peakDay ? 'bg-ink' : 'bg-ink/70') : future ? 'bg-line/50' : 'bg-line'
          return (
            <div key={day} className="flex h-full flex-1 items-end" title={`${day} ${formatMonthShort(month)}: ${fmt(amount)}`}>
              <div className={`w-full rounded-[3px] transition-[height] duration-500 ${color}`} style={{ height }} />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted tabular-nums">
        <span>1</span>
        <span>{Math.ceil(days / 2)}</span>
        <span>{days}</span>
      </div>
    </section>
  )
}
