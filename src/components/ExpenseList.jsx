import { useMemo, useState } from 'react'
import { CATEGORIES } from '../constants/categories.js'
import { formatDayLabel } from '../utils/format.js'
import { groupExpenses, sortExpenses, SORTS } from '../utils/sort.js'
import EmptyState from './EmptyState.jsx'
import ExpenseItem from './ExpenseItem.jsx'
import { ChevronDown, Search, Sort } from './Icons.jsx'

export default function ExpenseList({ expenses, sort, onSortChange, monthLabel, fmt, onEdit, emptyAction }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  // Only offer chips for categories that actually appear this month.
  const present = useMemo(() => CATEGORIES.filter((c) => expenses.some((e) => e.category === c.name)), [expenses])
  const activeCategory = category !== 'All' && !present.some((c) => c.name === category) ? 'All' : category

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = expenses.filter(
      (e) =>
        (activeCategory === 'All' || e.category === activeCategory) &&
        (!q || e.note.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || String(e.amount).includes(q)),
    )
    return groupExpenses(sortExpenses(filtered, sort), sort)
  }, [expenses, query, activeCategory, sort])

  const count = groups.reduce((n, g) => n + g.items.length, 0)
  const byDate = sort.startsWith('date')
  const subtitleFor = (e) => (byDate ? e.category : sort === 'category' ? formatDayLabel(e.date) : `${e.category} · ${formatDayLabel(e.date)}`)

  return (
    <section className="card overflow-hidden" aria-labelledby="activity-heading">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="activity-heading" className="text-[15px] font-semibold tracking-tight">
            Activity <span className="ml-1 font-normal text-muted tabular-nums">{count}</span>
          </h2>
          <label className="relative" data-tour="sort">
            <span className="sr-only">Sort expenses</span>
            <Sort className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <select
              className="chip h-9 cursor-pointer appearance-none bg-transparent pr-8 pl-9 text-[13px] font-medium"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted" />
          </label>
        </div>

        {expenses.length > 0 && (
          <div data-tour="search">
            <label className="relative mt-4 block">
              <span className="sr-only">Search expenses</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
              <input
                type="search"
                className="input h-11 rounded-full border-transparent bg-surface-2 pl-11"
                placeholder="Search notes, categories, amounts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {present.length > 1 && (
              <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Filter by category">
                {[{ name: 'All' }, ...present].map((c) => (
                  <button
                    key={c.name}
                    className={`chip ${activeCategory === c.name ? 'chip-active' : ''}`}
                    aria-pressed={activeCategory === c.name}
                    onClick={() => setCategory(c.name)}
                  >
                    {c.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />}
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {count > 0 ? (
        <div className="pt-2 pb-2" data-tour="activity-list">
          {groups.map((g) => (
            <div key={g.key ?? 'all'}>
              {g.key && (
                <div className="flex items-baseline justify-between px-5 pt-4 pb-1.5">
                  <h3 className="eyebrow">{byDate ? formatDayLabel(g.key) : g.key}</h3>
                  <span className="text-[12px] text-muted tabular-nums">{fmt(g.total)}</span>
                </div>
              )}
              <ul>
                {g.items.map((e) => (
                  <ExpenseItem key={e.id} expense={e} subtitle={subtitleFor(e)} fmt={fmt} onEdit={onEdit} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : expenses.length ? (
        <EmptyState title="No matches" message="Try another search or category." />
      ) : (
        <EmptyState title={`Nothing in ${monthLabel}`} message="Tap + to log your first expense. The summary updates as you go." action={emptyAction} />
      )}
    </section>
  )
}
