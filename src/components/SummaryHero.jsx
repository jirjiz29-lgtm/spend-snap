import { formatMonth, formatMonthShort, shiftMonth } from '../utils/format.js'
import { ArrowDownRight, ArrowUpRight } from './Icons.jsx'

/** Renders "₹2,698.50" with the decimals de-emphasised. */
function BigAmount({ text }) {
  const [, whole, fraction] = text.match(/^(.*?)(\.\d{2})?$/)
  // Scale to the card's own width (container units) so long totals never overflow.
  return (
    <p className="mt-1 leading-none font-semibold tracking-[-0.04em] whitespace-nowrap tabular-nums" style={{ fontSize: `min(56px, ${150 / text.length}cqw)` }}>
      {whole}
      {fraction && <span className="text-hero-muted">{fraction}</span>}
    </p>
  )
}

function Delta({ vs, month, fmt }) {
  const prev = formatMonthShort(shiftMonth(month, -1))
  if (!vs || vs.diff === 0) return <span className="text-xs text-hero-muted">{vs ? `Same as ${prev}` : `Nothing in ${prev}`}</span>
  const up = vs.diff > 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${up ? 'bg-[#ff7a6b]/15 text-[#ff9284]' : 'bg-accent/15 text-accent'}`}
      title={`${up ? 'Up' : 'Down'} ${fmt(Math.abs(vs.diff))} vs ${prev}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.round(Math.abs(vs.percent))}% vs {prev}
    </span>
  )
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0 px-3 first:pl-0 last:pr-0">
      <dt className="text-[11px] tracking-[0.06em] text-hero-muted uppercase">{label}</dt>
      <dd className="mt-1 truncate text-[15px] font-medium tabular-nums">{value}</dd>
    </div>
  )
}

export default function SummaryHero({ summary, fmt }) {
  const monthName = formatMonth(summary.month).split(' ')[0]
  return (
    <section className="@container rounded-[28px] bg-hero p-5 text-on-hero sm:p-6" aria-label="Monthly summary">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm text-hero-muted">Spent in {monthName}</h2>
        <Delta vs={summary.vsLastMonth} month={summary.month} fmt={fmt} />
      </div>
      <BigAmount text={fmt(summary.total)} />
      <p className="mt-3 text-sm leading-relaxed text-hero-muted">{summary.insight}</p>
      <dl className="mt-5 grid grid-cols-3 divide-x divide-hero-line border-t border-hero-line pt-4">
        <Stat label="Daily avg" value={fmt(summary.dailyAverage)} />
        <Stat label="Expenses" value={summary.count} />
        <Stat label="Biggest" value={summary.biggestExpense ? fmt(summary.biggestExpense.amount) : '—'} />
      </dl>
    </section>
  )
}
