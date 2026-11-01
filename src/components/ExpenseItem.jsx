import { CategoryTile } from './CategoryIcon.jsx'

export default function ExpenseItem({ expense, subtitle, fmt, onEdit }) {
  return (
    <li>
      <button
        className="flex w-full items-center gap-3.5 px-5 py-3 text-left transition-colors hover:bg-surface-2/60 active:bg-surface-2"
        onClick={() => onEdit(expense)}
      >
        <CategoryTile name={expense.category} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">{expense.note || expense.category}</span>
          <span className="block truncate text-[13px] text-muted">{subtitle}</span>
        </span>
        <span className="shrink-0 text-[15px] font-semibold tabular-nums">{fmt(expense.amount)}</span>
      </button>
    </li>
  )
}
