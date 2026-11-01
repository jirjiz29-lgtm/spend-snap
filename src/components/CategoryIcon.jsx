import { getCategory } from '../constants/categories.js'

export function CategoryIcon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={getCategory(name).icon} />
    </svg>
  )
}

/** Tinted square with the category glyph, used in lists. */
export function CategoryTile({ name, small = false }) {
  const { color } = getCategory(name)
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${small ? 'h-8 w-8 rounded-[10px]' : 'h-10 w-10 rounded-[13px]'}`}
      style={{ backgroundColor: `${color}24`, color }}
    >
      <CategoryIcon name={name} className={small ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
    </span>
  )
}
