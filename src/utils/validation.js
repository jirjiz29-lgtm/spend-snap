import { CATEGORY_NAMES } from '../constants/categories.js'
import { todayISO } from './format.js'

export const NOTE_MAX = 80
export const AMOUNT_MAX = 1_000_000_000

/** Returns an object of field → message. Empty object means valid. */
export function validateExpense({ amount, category, date, note }, today = todayISO()) {
  const errors = {}
  const raw = String(amount ?? '').trim()
  const value = Number(raw)

  if (!raw) errors.amount = 'Amount is required'
  else if (!/^-?(\d+\.?\d*|\.\d+)$/.test(raw) || Number.isNaN(value)) errors.amount = 'Enter a valid number'
  else if (value <= 0) errors.amount = 'Amount must be greater than 0'
  else if (!/^(\d+(\.\d{0,2})?|\.\d{1,2})$/.test(raw)) errors.amount = 'Use at most 2 decimal places'
  else if (value > AMOUNT_MAX) errors.amount = 'That amount is too large'

  if (!CATEGORY_NAMES.includes(category)) errors.category = 'Pick a category'

  if (!date) errors.date = 'Date is required'
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = 'Enter a valid date'
  else if (date > today) errors.date = "Date can't be in the future"

  if ((note ?? '').trim().length > NOTE_MAX) errors.note = `Keep the note under ${NOTE_MAX} characters`

  return errors
}

export const isValid = (errors) => Object.keys(errors).length === 0

/** Converts raw form values into the stored shape. Assumes values are valid. */
export function normalizeExpense({ amount, category, date, note }) {
  return {
    amount: Math.round(Number(amount) * 100) / 100,
    category,
    date,
    note: (note ?? '').trim(),
  }
}
