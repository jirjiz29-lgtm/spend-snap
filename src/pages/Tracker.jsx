import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryBreakdown from '../components/CategoryBreakdown.jsx'
import DailyChart from '../components/DailyChart.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import ExpenseList from '../components/ExpenseList.jsx'
import GuidedTour from '../components/GuidedTour.jsx'
import { Logo, Plus, Sliders } from '../components/Icons.jsx'
import MonthSwitcher from '../components/MonthSwitcher.jsx'
import SettingsPanel from '../components/SettingsPanel.jsx'
import Sheet from '../components/Sheet.jsx'
import SummaryHero from '../components/SummaryHero.jsx'
import Toast from '../components/Toast.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useExpenses } from '../hooks/useExpenses.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { parseBackup, toBackup } from '../utils/backup.js'
import { toCSV } from '../utils/csv.js'
import { downloadFile } from '../utils/download.js'
import { currencySymbol, formatCurrency, formatMonth, monthKey, todayISO } from '../utils/format.js'
import { isTourDone, markTourDone } from '../utils/storage.js'
import { filterByMonth, getSummary } from '../utils/summary.js'

const haptic = () => navigator.vibrate?.(8)

export default function Tracker() {
  useDocumentTitle('SpendSnap')
  const { expenses, addExpense, updateExpense, deleteExpense, restoreExpense, importExpenses, loadDemoData, removeExpenses, clearAll } = useExpenses()
  const [settings, updateSettings] = useSettings()
  const [month, setMonth] = useState(() => monthKey())
  const [sheet, setSheet] = useState(null) // { type: 'add' } | { type: 'edit', expense } | { type: 'settings' }
  const { toast, showToast, dismissToast } = useToast()
  const [params, setParams] = useSearchParams()
  // First visit shows the guided tour — unless the app was opened straight into "add" from a shortcut.
  const [tourOpen, setTourOpen] = useState(() => !isTourDone() && !params.get('add'))

  const { currency, sort } = settings
  const fmt = useCallback((amount) => formatCurrency(amount, currency), [currency])
  const symbol = useMemo(() => currencySymbol(currency), [currency])

  const monthExpenses = useMemo(() => filterByMonth(expenses, month), [expenses, month])
  const summary = useMemo(() => getSummary(expenses, month), [expenses, month])
  const monthLabel = formatMonth(month)

  // Home-screen shortcut: /app?add=1 opens the add sheet.
  useEffect(() => {
    if (params.get('add')) {
      setSheet({ type: 'add' })
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  const closeSheet = useCallback(() => setSheet(null), [])
  const openAdd = () => setSheet({ type: 'add' })

  function handleAdd(values) {
    addExpense(values)
    haptic()
    setSheet(null)
    const target = values.date.slice(0, 7)
    if (target !== month) setMonth(target)
    showToast('Expense added')
  }

  function handleUpdate(values) {
    updateExpense(sheet.expense.id, values)
    setSheet(null)
    showToast('Changes saved')
  }

  function handleDelete() {
    const removed = sheet.expense
    deleteExpense(removed.id)
    haptic()
    setSheet(null)
    showToast('Expense deleted', { label: 'Undo', onClick: () => restoreExpense(removed) })
  }

  function handleDemo() {
    loadDemoData()
    setSheet(null)
    setMonth(monthKey())
    showToast('Demo data loaded')
  }

  function handleExportCSV() {
    downloadFile(`spendsnap-${month}.csv`, toCSV(monthExpenses), 'text/csv;charset=utf-8')
    showToast(`Exported ${monthExpenses.length} expenses`)
  }

  function handleBackup() {
    downloadFile(`spendsnap-backup-${todayISO()}.json`, toBackup(expenses), 'application/json')
    showToast('Backup downloaded')
  }

  async function handleRestore(file) {
    try {
      const incoming = parseBackup(await file.text())
      importExpenses(incoming)
      setSheet(null)
      showToast(`Restored ${incoming.length} expenses`)
    } catch (err) {
      setSheet(null)
      showToast(err.message)
    }
  }

  function startTour() {
    setSheet(null)
    setMonth(monthKey())
    setTourOpen(true)
  }

  function handleTourClose({ demoLoaded }) {
    markTourDone()
    setTourOpen(false)
    if (demoLoaded) showToast('Sample data kept — clear it any time in Settings')
  }

  function handleClear() {
    if (window.confirm(`Delete all ${expenses.length} expenses from this device? This can’t be undone — back up first if unsure.`)) {
      clearAll()
      setSheet(null)
      showToast('All data deleted')
    }
  }

  return (
    <div className="min-h-dvh pb-[calc(env(safe-area-inset-bottom)+112px)] lg:pb-16">
      <header className="sticky top-0 z-30 border-b border-transparent bg-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 justify-self-start rounded-xl p-1" aria-label="SpendSnap home">
            <Logo className="h-8 w-8" />
            <span className="hidden text-[17px] font-semibold tracking-tight sm:inline">SpendSnap</span>
          </Link>
          <MonthSwitcher month={month} onChange={setMonth} />
          <div className="flex items-center gap-2 justify-self-end">
            <button className="btn-primary hidden h-10 px-4 text-sm lg:inline-flex" onClick={openAdd} data-tour="add-btn">
              <Plus className="h-4 w-4" /> Add expense
            </button>
            <button className="btn-icon" onClick={() => setSheet({ type: 'settings' })} aria-label="Settings and data" data-tour="settings">
              <Sliders className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-3 pt-2 sm:px-6 sm:pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-6">
        <div className="space-y-4 lg:sticky lg:top-24">
          <SummaryHero summary={summary} fmt={fmt} />
          <DailyChart expenses={monthExpenses} month={month} fmt={fmt} />
          <CategoryBreakdown summary={summary} fmt={fmt} />
        </div>
        <ExpenseList
          expenses={monthExpenses}
          sort={sort}
          onSortChange={(value) => updateSettings({ sort: value })}
          monthLabel={monthLabel}
          fmt={fmt}
          onEdit={(expense) => setSheet({ type: 'edit', expense })}
          emptyAction={
            expenses.length ? null : (
              <button className="btn-secondary h-11 text-sm" onClick={handleDemo}>Try it with demo data</button>
            )
          }
        />
      </main>

      <button
        className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+20px)] z-30 flex h-16 w-16 items-center justify-center rounded-[22px] bg-accent text-on-accent shadow-[0_10px_30px_-6px_rgb(0_0_0/0.35)] transition active:scale-95 lg:hidden"
        onClick={openAdd}
        aria-label="Add expense"
        data-tour="add-fab"
      >
        <Plus className="h-7 w-7" strokeWidth={2.2} />
      </button>

      <Sheet open={sheet?.type === 'add' || sheet?.type === 'edit'} onClose={closeSheet} title={sheet?.type === 'edit' ? 'Edit expense' : 'New expense'}>
        <ExpenseForm
          key={sheet?.expense?.id ?? 'new'}
          initial={sheet?.expense}
          currencySymbol={symbol}
          onSubmit={sheet?.type === 'edit' ? handleUpdate : handleAdd}
          onDelete={handleDelete}
        />
      </Sheet>

      <Sheet open={sheet?.type === 'settings'} onClose={closeSheet} title="Settings">
        <SettingsPanel
          currency={currency}
          onCurrencyChange={(code) => updateSettings({ currency: code })}
          monthLabel={formatMonth(month).split(' ')[0]}
          monthCount={monthExpenses.length}
          totalCount={expenses.length}
          onExportCSV={handleExportCSV}
          onBackup={handleBackup}
          onRestore={handleRestore}
          onDemo={handleDemo}
          onClear={handleClear}
          onTour={startTour}
        />
      </Sheet>

      <GuidedTour
        open={tourOpen}
        hasExpenses={expenses.length > 0}
        onLoadDemo={loadDemoData}
        onRemoveDemo={removeExpenses}
        onAddExpense={openAdd}
        onClose={handleTourClose}
      />

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}
