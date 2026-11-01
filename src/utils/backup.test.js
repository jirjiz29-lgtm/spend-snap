import { describe, expect, it } from 'vitest'
import { mergeExpenses, parseBackup, toBackup } from './backup.js'

const x = { id: 'x', amount: 10, category: 'Food', date: '2026-11-01', note: '', createdAt: 1 }

describe('backup', () => {
  it('round-trips through toBackup / parseBackup', () => expect(parseBackup(toBackup([x]))).toEqual([x]))
  it('accepts a bare array', () => expect(parseBackup(JSON.stringify([x]))).toEqual([x]))
  it('rejects invalid JSON and foreign files', () => {
    expect(() => parseBackup('nope')).toThrow(/valid JSON/)
    expect(() => parseBackup('{"foo":1}')).toThrow(/SpendSnap backup/)
  })
  it('drops malformed records', () => {
    expect(parseBackup(JSON.stringify({ app: 'spendsnap', expenses: [x, { amount: -1 }] }))).toEqual([x])
  })
  it('merges by id, replacing duplicates', () => {
    const y = { ...x, id: 'y' }
    expect(mergeExpenses([x], [{ ...x, amount: 99 }, y])).toEqual([{ ...x, amount: 99 }, y])
  })
})
