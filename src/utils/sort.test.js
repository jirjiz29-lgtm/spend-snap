import { describe, expect, it } from 'vitest'
import { groupExpenses, sortExpenses } from './sort.js'

const e = (id, amount, category, date, createdAt = 0) => ({ id, amount, category, date, note: '', createdAt })
const LIST = [
  e('a', 50, 'Food', '2026-11-01', 1),
  e('b', 900, 'Bills', '2026-10-30'),
  e('c', 50.5, 'Food', '2026-11-01', 2),
  e('d', 10, 'Transport', '2026-10-31'),
]
const ids = (list) => list.map((x) => x.id).join('')

describe('sortExpenses', () => {
  it('newest first, ties broken by creation time', () => expect(ids(sortExpenses(LIST, 'date-desc'))).toBe('cadb'))
  it('oldest first', () => expect(ids(sortExpenses(LIST, 'date-asc'))).toBe('bdac'))
  it('highest amount', () => expect(ids(sortExpenses(LIST, 'amount-desc'))).toBe('bcad'))
  it('lowest amount', () => expect(ids(sortExpenses(LIST, 'amount-asc'))).toBe('dacb'))
  it('by category, then amount', () => expect(ids(sortExpenses(LIST, 'category'))).toBe('bcad'))
  it('falls back to newest for unknown sort and does not mutate', () => {
    expect(ids(sortExpenses(LIST, 'nope'))).toBe('cadb')
    expect(ids(LIST)).toBe('abcd')
  })
})

describe('groupExpenses', () => {
  it('groups by day with cent-safe totals', () => {
    const groups = groupExpenses(sortExpenses(LIST, 'date-desc'), 'date-desc')
    expect(groups.map((g) => [g.key, g.total])).toEqual([['2026-11-01', 100.5], ['2026-10-31', 10], ['2026-10-30', 900]])
  })
  it('groups by category', () => {
    expect(groupExpenses(sortExpenses(LIST, 'category'), 'category').map((g) => g.key)).toEqual(['Bills', 'Food', 'Transport'])
  })
  it('uses one section for amount sorts', () => {
    const groups = groupExpenses(sortExpenses(LIST, 'amount-desc'), 'amount-desc')
    expect(groups).toHaveLength(1)
    expect(groups[0]).toMatchObject({ key: null, total: 1010.5 })
  })
  it('handles an empty list', () => expect(groupExpenses([], 'date-desc')).toEqual([]))
})
