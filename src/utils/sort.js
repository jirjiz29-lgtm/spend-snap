export const SORTS = [
  { id: 'date-desc', label: 'Newest first' },
  { id: 'date-asc', label: 'Oldest first' },
  { id: 'amount-desc', label: 'Highest amount' },
  { id: 'amount-asc', label: 'Lowest amount' },
  { id: 'category', label: 'By category' },
]

const byDate = (a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt

const COMPARATORS = {
  'date-desc': (a, b) => byDate(b, a),
  'date-asc': byDate,
  'amount-desc': (a, b) => b.amount - a.amount || byDate(b, a),
  'amount-asc': (a, b) => a.amount - b.amount || byDate(b, a),
  category: (a, b) => a.category.localeCompare(b.category) || b.amount - a.amount,
}

export function sortExpenses(expenses, sort = 'date-desc') {
  return [...expenses].sort(COMPARATORS[sort] ?? COMPARATORS['date-desc'])
}

/**
 * Splits an already-sorted list into sections: by day for date sorts, by category for the
 * category sort, and a single unlabelled section for amount sorts. Totals are summed in cents.
 */
export function groupExpenses(sorted, sort = 'date-desc') {
  const keyOf = sort.startsWith('date') ? (e) => e.date : sort === 'category' ? (e) => e.category : () => null
  const groups = []
  for (const e of sorted) {
    const key = keyOf(e)
    let group = groups[groups.length - 1]
    if (!group || group.key !== key) groups.push((group = { key, items: [], cents: 0 }))
    group.items.push(e)
    group.cents += Math.round(e.amount * 100)
  }
  return groups.map(({ key, items, cents }) => ({ key, items, total: cents / 100 }))
}
