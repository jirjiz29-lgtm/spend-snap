import { sanitizeExpenses } from './storage.js'

export function toBackup(expenses, now = new Date()) {
  return JSON.stringify({ app: 'spendsnap', version: 1, exportedAt: now.toISOString(), expenses }, null, 2)
}

/** Parses a backup file (or a bare array) into clean expenses. Throws a user-facing message on bad input. */
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error("That file isn't valid JSON.")
  }
  const list = Array.isArray(data) ? data : data?.app === 'spendsnap' ? data.expenses : null
  if (!Array.isArray(list)) throw new Error("That file isn't a SpendSnap backup.")
  return sanitizeExpenses(list)
}

/** Adds incoming expenses; an incoming record replaces an existing one with the same id. */
export function mergeExpenses(current, incoming) {
  const byId = new Map(current.map((e) => [e.id, e]))
  for (const e of incoming) byId.set(e.id, e)
  return [...byId.values()]
}
