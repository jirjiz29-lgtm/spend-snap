import { beforeEach, describe, expect, it } from 'vitest'
import { loadExpenses, saveExpenses, STORAGE_KEY } from './storage.js'
import { toCSV } from './csv.js'

beforeEach(() => {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  }
})

describe('storage', () => {
  it('returns [] when nothing is stored', () => expect(loadExpenses()).toEqual([]))

  it('returns [] for corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadExpenses()).toEqual([])
  })

  it('drops malformed records and repairs recoverable ones', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([null, { amount: -5, date: '2026-11-01' }, { id: 'a', amount: '20', category: 'Nope', date: '2026-11-01' }]),
    )
    expect(loadExpenses()).toEqual([{ id: 'a', amount: 20, category: 'Other', date: '2026-11-01', note: '', createdAt: 0 }])
  })

  it('round-trips saved expenses', () => {
    const list = [{ id: 'x', amount: 10, category: 'Food', date: '2026-11-01', note: 'n', createdAt: 1 }]
    saveExpenses(list)
    expect(loadExpenses()).toEqual(list)
  })
})

describe('toCSV', () => {
  it('escapes quotes/commas and neutralises formulas', () => {
    const csv = toCSV([
      { amount: 5, category: 'Food', date: '2026-11-02', note: 'Tea, "chai"', createdAt: 0 },
      { amount: 7, category: 'Other', date: '2026-11-01', note: '=SUM(A1)', createdAt: 0 },
    ])
    expect(csv.split('\r\n')).toEqual([
      'Date,Category,Amount,Note',
      "2026-11-01,Other,7.00,'=SUM(A1)",
      '2026-11-02,Food,5.00,"Tea, ""chai"""',
    ])
  })
})
