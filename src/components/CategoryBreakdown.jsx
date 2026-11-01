import { getCategory } from '../constants/categories.js'
import { CategoryTile } from './CategoryIcon.jsx'

export default function CategoryBreakdown({ summary, fmt }) {
  const data = summary.byCategory

  return (
    <section className="card p-5" aria-labelledby="cat-heading">
      <div className="flex items-baseline justify-between">
        <h2 id="cat-heading" className="text-[15px] font-semibold tracking-tight">Where it went</h2>
        {data.length > 0 && <span className="text-xs text-muted">{data.length} {data.length === 1 ? 'category' : 'categories'}</span>}
      </div>

      {data.length === 0 ? (
        <>
          <div className="mt-5 h-3 rounded-full bg-surface-2" />
          <p className="mt-4 text-sm text-muted">Your category split shows up after the first expense.</p>
        </>
      ) : (
        <>
          <div className="mt-5 flex h-3 gap-[3px]" role="img" aria-label={data.map((d) => `${d.name} ${d.percent}%`).join(', ')}>
            {data.map((d) => (
              <div
                key={d.name}
                className="h-full rounded-full transition-[flex-grow] duration-500"
                style={{ flexGrow: d.amount, flexBasis: 6, backgroundColor: getCategory(d.name).color }}
              />
            ))}
          </div>
          <ul className="mt-5 space-y-3.5">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-3">
                <CategoryTile name={d.name} small />
                <span className="min-w-0 flex-1 truncate text-[15px]">{d.name}</span>
                <span className="w-12 text-right text-[13px] text-muted tabular-nums">{d.percent}%</span>
                <span className="w-24 text-right text-[15px] font-medium tabular-nums">{fmt(d.amount)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
