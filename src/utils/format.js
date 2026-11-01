export const CURRENCIES = [
  { code: 'INR', locale: 'en-IN', label: '₹ INR' },
  { code: 'USD', locale: 'en-US', label: '$ USD' },
  { code: 'EUR', locale: 'en-IE', label: '€ EUR' },
  { code: 'GBP', locale: 'en-GB', label: '£ GBP' },
]

const formatters = new Map()

export function formatCurrency(amount, code = 'INR') {
  if (!formatters.has(code)) {
    const { locale } = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
    formatters.set(
      code,
      new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 2 }),
    )
  }
  return formatters.get(code).format(amount)
}

const pad = (n) => String(n).padStart(2, '0')

// All dates are handled as local "YYYY-MM-DD" strings — never via toISOString(),
// which converts to UTC and can shift the day for users east/west of GMT.
export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function monthKey(date = new Date()) {
  return toISODate(date).slice(0, 7)
}

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d ?? 1)
}

export function addDays(iso, days) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function shiftMonth(key, delta) {
  const [y, m] = key.split('-').map(Number)
  return monthKey(new Date(y, m - 1 + delta, 1))
}

export function daysInMonth(key) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function formatMonth(key) {
  return parseISO(`${key}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatDate(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function currencySymbol(code = 'INR') {
  const { locale } = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
  return new Intl.NumberFormat(locale, { style: 'currency', currency: code }).formatToParts(0).find((p) => p.type === 'currency')?.value ?? code
}

/** "Today", "Yesterday", or "Sat, 29 Oct". */
export function formatDayLabel(iso, today = todayISO()) {
  if (iso === today) return 'Today'
  if (iso === addDays(today, -1)) return 'Yesterday'
  return parseISO(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatMonthShort(key) {
  return parseISO(`${key}-01`).toLocaleDateString('en-US', { month: 'short' })
}
