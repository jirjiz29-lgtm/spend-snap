import { daysInMonth, formatMonth, monthKey, shiftMonth } from './format.js'

// Money is summed in integer cents/paise to avoid floating-point drift (0.1 + 0.2).
const toCents = (amount) => Math.round(Number(amount) * 100)
const fromCents = (cents) => cents / 100
const round1 = (n) => Math.round(n * 10) / 10

export function filterByMonth(expenses, month) {
  return expenses.filter((e) => e.date.slice(0, 7) === month)
}

export function getTotal(expenses) {
  return fromCents(expenses.reduce((sum, e) => sum + toCents(e.amount), 0))
}

/** Category totals, largest first, with share of the total in percent (1 decimal). */
export function getByCategory(expenses) {
  const totals = new Map()
  for (const e of expenses) totals.set(e.category, (totals.get(e.category) ?? 0) + toCents(e.amount))
  const grand = [...totals.values()].reduce((a, b) => a + b, 0)
  return [...totals.entries()]
    .map(([name, cents]) => ({ name, amount: fromCents(cents), percent: grand ? round1((cents / grand) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
}

export function getTopCategory(expenses) {
  return getByCategory(expenses)[0] ?? null
}

/** Days the average is spread over: days elapsed for the current month, full length for others. */
export function getDaysCounted(month, today = new Date()) {
  return month === monthKey(today) ? today.getDate() : daysInMonth(month)
}

export function getDailyAverage(expenses, month, today = new Date()) {
  const cents = expenses.reduce((sum, e) => sum + toCents(e.amount), 0)
  return fromCents(Math.round(cents / getDaysCounted(month, today)))
}

export function getBiggestExpense(expenses) {
  if (!expenses.length) return null
  const top = expenses.reduce((max, e) => (toCents(e.amount) > toCents(max.amount) ? e : max))
  return { amount: top.amount, note: top.note || top.category, category: top.category, date: top.date }
}

export function getVsLastMonth(allExpenses, month) {
  const current = toCents(getTotal(filterByMonth(allExpenses, month)))
  const previous = toCents(getTotal(filterByMonth(allExpenses, shiftMonth(month, -1))))
  if (!previous) return null
  return { diff: fromCents(current - previous), percent: round1(((current - previous) / previous) * 100) }
}

export function getInsight(summary, today = new Date()) {
  const when = summary.month === monthKey(today) ? 'this month' : `in ${formatMonth(summary.month)}`
  const top = summary.topCategory
  if (!summary.count || !top) return `No expenses ${when} yet. Add one to see your summary.`
  if (summary.byCategory.length === 1) return `All of your spending ${when} is on ${top.name}.`
  return `${top.name} is ${Math.round(top.percent)}% of your spending — your biggest category ${when}.`
}

/** Amount spent on each day of the month, index 0 = day 1. */
export function getDailySeries(expenses, month) {
  const cents = Array.from({ length: daysInMonth(month) }, () => 0)
  for (const e of filterByMonth(expenses, month)) cents[Number(e.date.slice(8, 10)) - 1] += toCents(e.amount)
  return cents.map(fromCents)
}

/** Builds the full summary object for one month (see CLAUDE.md → Summary output). */
export function getSummary(allExpenses, month, today = new Date()) {
  const monthly = filterByMonth(allExpenses, month)
  const byCategory = getByCategory(monthly)
  const summary = {
    month,
    total: getTotal(monthly),
    count: monthly.length,
    daysCounted: getDaysCounted(month, today),
    dailyAverage: getDailyAverage(monthly, month, today),
    topCategory: byCategory[0] ?? null,
    biggestExpense: getBiggestExpense(monthly),
    byCategory,
    vsLastMonth: getVsLastMonth(allExpenses, month),
  }
  summary.insight = getInsight(summary, today)
  return summary
}
