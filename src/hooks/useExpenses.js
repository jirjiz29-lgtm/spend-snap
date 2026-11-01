import { useCallback, useEffect, useState } from 'react'
import { loadExpenses, newId, saveExpenses, STORAGE_KEY } from '../utils/storage.js'
import { normalizeExpense } from '../utils/validation.js'
import { makeDemoExpenses } from '../utils/demo.js'
import { mergeExpenses } from '../utils/backup.js'

export function useExpenses() {
  const [expenses, setExpenses] = useState(loadExpenses)

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setExpenses(loadExpenses())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addExpense = useCallback((input) => {
    const expense = { id: newId(), ...normalizeExpense(input), createdAt: Date.now() }
    setExpenses((prev) => [expense, ...prev])
    return expense
  }, [])

  const updateExpense = useCallback((id, input) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...normalizeExpense(input) } : e)))
  }, [])

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  /** Puts a deleted expense back (used by the Undo toast). */
  const restoreExpense = useCallback((expense) => {
    setExpenses((prev) => (prev.some((e) => e.id === expense.id) ? prev : [expense, ...prev]))
  }, [])

  const importExpenses = useCallback((incoming) => setExpenses((prev) => mergeExpenses(prev, incoming)), [])

  /** Adds sample data and returns the new ids so it can be removed again later. */
  const loadDemoData = useCallback(() => {
    const demo = makeDemoExpenses()
    setExpenses((prev) => [...demo, ...prev])
    return demo.map((e) => e.id)
  }, [])

  const removeExpenses = useCallback((ids) => {
    const remove = new Set(ids)
    setExpenses((prev) => prev.filter((e) => !remove.has(e.id)))
  }, [])
  const clearAll = useCallback(() => setExpenses([]), [])

  return { expenses, addExpense, updateExpense, deleteExpense, restoreExpense, importExpenses, loadDemoData, removeExpenses, clearAll }
}
