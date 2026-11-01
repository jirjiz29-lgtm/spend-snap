// Fixed v1 category list. `color` is shared by list icons, the breakdown bar and the picker.
// `icon` is a 24×24 stroke path; `short` is the label used where space is tight.
export const CATEGORIES = [
  { name: 'Food', color: '#F28C38', icon: 'M7 3v8M4 3v4.5a3 3 0 0 0 6 0V3M7 11v10M18 21V3c-2.2 1.2-3.5 4-3.5 7.5H18' },
  { name: 'Transport', color: '#4C8DF6', icon: 'M6 18V6.5A3.5 3.5 0 0 1 9.5 3h5A3.5 3.5 0 0 1 18 6.5V18M6 12h12M6 18h12M8 18v2.5M16 18v2.5M9 15h.01M15 15h.01' },
  { name: 'Shopping', color: '#E0609A', icon: 'M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8ZM9 10V6.5a3 3 0 0 1 6 0V10' },
  { name: 'Bills', color: '#D4A72C', icon: 'M6 3h12v18l-3-1.8-3 1.8-3-1.8-3 1.8V3ZM9.5 8h5M9.5 12h5M9.5 16h3' },
  { name: 'Entertainment', short: 'Fun', color: '#9B7BF0', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM10 8.8l5 3.2-5 3.2V8.8Z' },
  { name: 'Health', color: '#EE5D5D', icon: 'M19.5 12.6 12 20l-7.5-7.4A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 7.5 6.2ZM8 12.5h2l1.2-2 1.6 4 1.2-2h2' },
  { name: 'Education', short: 'Learning', color: '#2BB3A3', icon: 'M3 8.5 12 4l9 4.5-9 4.5-9-4.5ZM7 10.5v4.2c0 1.3 2.2 2.8 5 2.8s5-1.5 5-2.8v-4.2M21 8.5v5' },
  { name: 'Other', color: '#8C8C86', icon: 'M12 3 3 7.5l9 4.5 9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5' },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

const BY_NAME = Object.fromEntries(CATEGORIES.map((c) => [c.name, c]))

export function getCategory(name) {
  return BY_NAME[name] ?? BY_NAME.Other
}
