import { describe, expect, it } from 'vitest'
import {
  filterByMonth,
  getBiggestExpense,
  getByCategory,
  getDailySeries,
  getDailyAverage,
  getInsight,
  getSummary,
  getTotal,
  getVsLastMonth,
} from './summary.js'

const e = (amount, category, date, note = '') => ({ id: `${amount}${date}`, amount, category, date, note, createdAt: 0 })

// Fixed "today" so tests never depend on the real clock.
const TODAY = new Date(2026, 10, 10) // 10 Nov 2026

const SAMPLE = [
  e(450, 'Food', '2026-11-01', 'Lunch'),
  e(3200, 'Bills', '2026-11-02', 'Electricity bill'),
  e(150, 'Food', '2026-11-05'),
  e(200, 'Transport', '2026-11-10'),
  e(1000, 'Shopping', '2026-10-31'),
  e(999, 'Food', '2026-12-01'),
]

describe('filterByMonth', () => {
  it('keeps only expenses in the month, including boundary days', () => {
    const nov = filterByMonth(SAMPLE, '2026-11')
    expect(nov).toHaveLength(4)
    expect(nov.map((x) => x.date)).not.toContain('2026-10-31')
    expect(nov.map((x) => x.date)).not.toContain('2026-12-01')
  })
})

describe('getTotal', () => {
  it('returns 0 for no expenses', () => expect(getTotal([])).toBe(0))
  it('avoids floating point errors', () => {
    expect(getTotal([e(0.1, 'Food', '2026-11-01'), e(0.2, 'Food', '2026-11-01')])).toBe(0.3)
  })
})

describe('getByCategory', () => {
  it('groups, sorts largest first and computes percent', () => {
    const result = getByCategory(filterByMonth(SAMPLE, '2026-11'))
    expect(result[0]).toEqual({ name: 'Bills', amount: 3200, percent: 80 })
    expect(result[1]).toEqual({ name: 'Food', amount: 600, percent: 15 })
    expect(result[2]).toEqual({ name: 'Transport', amount: 200, percent: 5 })
  })
  it('returns [] when empty', () => expect(getByCategory([])).toEqual([]))
})

describe('getDailyAverage', () => {
  it('divides by days elapsed for the current month', () => {
    expect(getDailyAverage(filterByMonth(SAMPLE, '2026-11'), '2026-11', TODAY)).toBe(400) // 4000 / 10
  })
  it('divides by days in month for past months', () => {
    expect(getDailyAverage([e(3100, 'Bills', '2026-10-05')], '2026-10', TODAY)).toBe(100) // 3100 / 31
  })
  it('is 0 with no expenses', () => expect(getDailyAverage([], '2026-11', TODAY)).toBe(0))
})

describe('getBiggestExpense', () => {
  it('returns null for empty list', () => expect(getBiggestExpense([])).toBeNull())
  it('falls back to category when note is empty', () => {
    expect(getBiggestExpense([e(50, 'Health', '2026-11-01')]).note).toBe('Health')
  })
})

describe('getVsLastMonth', () => {
  it('compares with the previous month', () => {
    expect(getVsLastMonth(SAMPLE, '2026-11')).toEqual({ diff: 3000, percent: 300 })
  })
  it('is null when last month had no spending', () => expect(getVsLastMonth(SAMPLE, '2026-10')).toBeNull())
})

describe('getSummary', () => {
  it('builds the full summary for a month', () => {
    const s = getSummary(SAMPLE, '2026-11', TODAY)
    expect(s).toMatchObject({
      month: '2026-11',
      total: 4000,
      count: 4,
      dailyAverage: 400,
      topCategory: { name: 'Bills', amount: 3200, percent: 80 },
      biggestExpense: { amount: 3200, note: 'Electricity bill' },
    })
    expect(s.insight).toBe('Bills is 80% of your spending — your biggest category this month.')
  })

  it('handles an empty month', () => {
    const s = getSummary([], '2026-11', TODAY)
    expect(s).toMatchObject({ total: 0, count: 0, dailyAverage: 0, topCategory: null, biggestExpense: null, vsLastMonth: null })
    expect(s.insight).toMatch(/No expenses this month/)
  })

  it('handles a single expense', () => {
    const s = getSummary([e(99.99, 'Food', '2026-09-15')], '2026-09', TODAY)
    expect(s.total).toBe(99.99)
    expect(s.topCategory.percent).toBe(100)
    expect(s.insight).toBe('All of your spending in September 2026 is on Food.')
  })
})

describe('getInsight', () => {
  it('names past months explicitly', () => {
    const s = getSummary(SAMPLE, '2026-10', TODAY)
    expect(getInsight(s, TODAY)).toMatch(/in October 2026/)
  })
})

describe('getDailySeries', () => {
  it('has one slot per day and sums per day', () => {
    const series = getDailySeries(SAMPLE, '2026-11')
    expect(series).toHaveLength(30)
    expect(series[0]).toBe(450)
    expect(series[1]).toBe(3200)
    expect(series[9]).toBe(200)
    expect(series.reduce((a, b) => a + b, 0)).toBe(4000)
  })
})
