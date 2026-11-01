import { CATEGORY_NAMES } from '../constants/categories.js'
import { NOTE_MAX } from './validation.js'

export const STORAGE_KEY = 'spendsnap_expenses_v1'
export const SETTINGS_KEY = 'spendsnap_settings_v1'

const DEFAULT_SETTINGS = { currency: 'INR', sort: 'date-desc' }

function readJSON(key) {
  try {
    const raw = globalThis.localStorage?.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJSON(key, value) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false // quota exceeded or storage disabled
  }
}

/** Keeps only well-formed records so corrupted storage never crashes the app. */
function sanitize(e) {
  if (!e || typeof e !== 'object') return null
  const amount = Number(e.amount)
  if (!Number.isFinite(amount) || amount <= 0) return null
  if (typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) return null
  return {
    id: typeof e.id === 'string' && e.id ? e.id : newId(),
    amount: Math.round(amount * 100) / 100,
    category: CATEGORY_NAMES.includes(e.category) ? e.category : 'Other',
    date: e.date,
    note: typeof e.note === 'string' ? e.note.slice(0, NOTE_MAX) : '',
    createdAt: Number.isFinite(e.createdAt) ? e.createdAt : 0,
  }
}

export const sanitizeExpenses = (list) => list.map(sanitize).filter(Boolean)

export function loadExpenses() {
  const data = readJSON(STORAGE_KEY)
  return Array.isArray(data) ? sanitizeExpenses(data) : []
}

export const saveExpenses = (expenses) => writeJSON(STORAGE_KEY, expenses)

export function loadSettings() {
  const data = readJSON(SETTINGS_KEY)
  return { ...DEFAULT_SETTINGS, ...(data && typeof data === 'object' ? data : {}) }
}

export const saveSettings = (settings) => writeJSON(SETTINGS_KEY, settings)

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
