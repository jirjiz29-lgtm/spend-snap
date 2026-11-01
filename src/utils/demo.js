import { addDays, todayISO } from './format.js'
import { newId } from './storage.js'

// [days ago, amount, category, note] — relative to today so dates are never in the future.
const SAMPLE = [
  [0, 180, 'Food', 'Breakfast & coffee'],
  [0, 120, 'Transport', 'Metro card top-up'],
  [0, 649, 'Entertainment', 'Movie night'],
  [0, 1299, 'Shopping', 'New headphones'],
  [1, 3200, 'Bills', 'Electricity bill'],
  [2, 450, 'Food', 'Lunch with team'],
  [3, 260, 'Transport', 'Cab to office'],
  [4, 899, 'Health', 'Pharmacy'],
  [6, 1499, 'Education', 'Online course'],
  [7, 720, 'Food', 'Groceries'],
  [9, 1999, 'Shopping', 'Running shoes'],
  [11, 349, 'Entertainment', 'Streaming subscription'],
  [13, 560, 'Food', 'Dinner out'],
  [16, 999, 'Bills', 'Internet'],
  [19, 300, 'Other', 'Gift wrap & card'],
  [22, 640, 'Food', 'Groceries'],
  [26, 410, 'Transport', 'Fuel'],
  [33, 2800, 'Bills', 'Phone + electricity'],
  [38, 1150, 'Food', 'Weekend groceries'],
  [45, 799, 'Health', 'Gym membership'],
]

export function makeDemoExpenses(today = todayISO()) {
  const now = Date.now()
  return SAMPLE.map(([ago, amount, category, note], i) => ({
    id: newId(),
    amount,
    category,
    date: addDays(today, -ago),
    note,
    createdAt: now - i,
  }))
}
