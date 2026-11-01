import { describe, expect, it } from 'vitest'
import { normalizeExpense, validateExpense } from './validation.js'

const TODAY = '2026-11-01'
const ok = { amount: '450', category: 'Food', date: '2026-11-01', note: '' }
const errorFor = (patch) => validateExpense({ ...ok, ...patch }, TODAY)

describe('validateExpense', () => {
  it('accepts a valid expense', () => expect(errorFor({})).toEqual({}))
  it('requires an amount', () => expect(errorFor({ amount: '' }).amount).toBeDefined())
  it.each(['0', '-50', '0.00'])('blocks non-positive amount %s', (amount) => {
    expect(errorFor({ amount }).amount).toBe('Amount must be greater than 0')
  })
  it.each(['abc', '1e5', '12,50'])('blocks invalid number %s', (amount) => {
    expect(errorFor({ amount }).amount).toBeDefined()
  })
  it('allows max 2 decimals', () => {
    expect(errorFor({ amount: '10.25' })).toEqual({})
    expect(errorFor({ amount: '10.255' }).amount).toBe('Use at most 2 decimal places')
  })
  it('blocks future dates', () => expect(errorFor({ date: '2026-11-02' }).date).toBeDefined())
  it('requires a known category', () => expect(errorFor({ category: 'Crypto' }).category).toBeDefined())
  it('limits note to 80 chars', () => {
    expect(errorFor({ note: 'x'.repeat(80) })).toEqual({})
    expect(errorFor({ note: 'x'.repeat(81) }).note).toBeDefined()
  })
})

describe('normalizeExpense', () => {
  it('converts amount to a number and trims the note', () => {
    expect(normalizeExpense({ ...ok, amount: '12.5', note: '  hi ' })).toEqual({ amount: 12.5, category: 'Food', date: TODAY, note: 'hi' })
  })
})
