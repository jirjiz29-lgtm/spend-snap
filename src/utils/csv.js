function cell(value) {
  let s = String(value ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}` // block spreadsheet formula injection
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCSV(expenses) {
  const rows = [...expenses]
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)
    .map((e) => [e.date, e.category, e.amount.toFixed(2), e.note].map(cell).join(','))
  return ['Date,Category,Amount,Note', ...rows].join('\r\n')
}
