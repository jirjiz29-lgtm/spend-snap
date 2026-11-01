import { useRef, useState } from 'react'
import { CATEGORIES } from '../constants/categories.js'
import { addDays, todayISO } from '../utils/format.js'
import { isValid, NOTE_MAX, validateExpense } from '../utils/validation.js'
import { CategoryIcon } from './CategoryIcon.jsx'
import { Trash } from './Icons.jsx'

const ALL_TOUCHED = { amount: true, category: true, date: true, note: true }

function Error({ id, children }) {
  return (
    <p id={id} className="mt-1.5 min-h-4 text-[13px] text-danger" role={children ? 'alert' : undefined}>
      {children}
    </p>
  )
}

/** Add form when `initial` is absent; edit form (with Delete) when it's an expense. */
export default function ExpenseForm({ initial, onSubmit, onDelete, currencySymbol }) {
  const editing = Boolean(initial)
  const today = todayISO()
  const yesterday = addDays(today, -1)
  const [values, setValues] = useState(() =>
    editing
      ? { amount: String(initial.amount), category: initial.category, date: initial.date, note: initial.note }
      : { amount: '', category: 'Food', date: today, note: '' },
  )
  const [touched, setTouched] = useState({})
  const amountRef = useRef(null)

  const errors = validateExpense(values)
  const valid = isValid(errors)
  const errorOf = (field) => (touched[field] ? errors[field] : undefined)

  const set = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }))
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!valid) {
      setTouched(ALL_TOUCHED)
      if (errors.amount) amountRef.current?.focus()
      return
    }
    onSubmit(values)
  }

  const isOtherDate = values.date !== today && values.date !== yesterday

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="amount" className="eyebrow">Amount</label>
        <div
          className={`mt-1 flex items-baseline gap-1.5 border-b-2 pb-1.5 transition-colors ${
            errorOf('amount') ? 'border-danger' : 'border-line focus-within:border-ink'
          }`}
        >
          <span className="text-3xl font-medium text-muted">{currencySymbol}</span>
          <input
            id="amount"
            ref={amountRef}
            className="w-full min-w-0 bg-transparent text-[44px] leading-tight font-semibold tracking-tight tabular-nums outline-none placeholder:text-line"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="done"
            placeholder="0"
            value={values.amount}
            onChange={(e) => set('amount', e.target.value)}
            aria-invalid={Boolean(errorOf('amount'))}
            aria-describedby="amount-error"
            autoFocus
          />
        </div>
        <Error id="amount-error">{errorOf('amount')}</Error>
      </div>

      <fieldset>
        <legend className="eyebrow">Category</legend>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <label key={c.name} className="cursor-pointer" title={c.name}>
              <input
                type="radio"
                name="category"
                value={c.name}
                checked={values.category === c.name}
                onChange={() => set('category', c.name)}
                className="peer sr-only"
              />
              <span
                className="flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-line text-[12px] font-medium text-ink-2 transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink active:scale-95"
              >
                <span style={{ color: c.color }}>
                  <CategoryIcon name={c.name} className="h-5 w-5" />
                </span>
                {c.short ?? c.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow">Date</legend>
        <div className="mt-2.5 flex gap-2">
          <button type="button" className={`chip h-11 ${values.date === today ? 'chip-active' : ''}`} onClick={() => set('date', today)}>
            Today
          </button>
          <button type="button" className={`chip h-11 ${values.date === yesterday ? 'chip-active' : ''}`} onClick={() => set('date', yesterday)}>
            Yesterday
          </button>
          <input
            type="date"
            aria-label="Pick a date"
            className={`chip h-11 min-w-0 flex-1 bg-transparent text-base ${isOtherDate ? 'chip-active' : ''}`}
            max={today}
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
            aria-invalid={Boolean(errorOf('date'))}
          />
        </div>
        <Error>{errorOf('date')}</Error>
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="note" className="eyebrow">Note</label>
          <span className={`text-[11px] tabular-nums ${values.note.length > NOTE_MAX ? 'text-danger' : 'text-muted'}`}>
            {values.note.length}/{NOTE_MAX}
          </span>
        </div>
        <input
          id="note"
          className="input mt-2"
          placeholder="What was it for? (optional)"
          enterKeyHint="done"
          value={values.note}
          onChange={(e) => set('note', e.target.value)}
          aria-invalid={Boolean(errorOf('note'))}
        />
        <Error>{errorOf('note')}</Error>
      </div>

      <div className="flex gap-2.5">
        {editing && (
          <button type="button" className="btn-secondary px-4 text-danger" onClick={onDelete} aria-label="Delete expense">
            <Trash className="h-5 w-5" />
          </button>
        )}
        <button type="submit" aria-disabled={!valid} className={`btn-primary flex-1 ${valid ? '' : 'opacity-40'}`}>
          {editing ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  )
}
