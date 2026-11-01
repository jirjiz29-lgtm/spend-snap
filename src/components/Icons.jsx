const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true }

export const Logo = (p) => (
  <svg viewBox="0 0 512 512" aria-hidden="true" {...p}>
    <rect width="512" height="512" rx="120" fill="#121212" />
    <g transform="translate(-5 5)">
      <path d="M246 266V116a150 150 0 1 0 150 150Z" fill="#C8F169" />
      <path d="M276 236V86a150 150 0 0 1 150 150Z" fill="#F4F3EF" />
    </g>
  </svg>
)
export const ChevronLeft = (p) => <svg {...base} {...p}><path d="m15 18-6-6 6-6" /></svg>
export const ChevronRight = (p) => <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
export const ChevronDown = (p) => <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
export const Plus = (p) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
export const X = (p) => <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
export const Sliders = (p) => <svg {...base} {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
export const Search = (p) => <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const Sort = (p) => <svg {...base} {...p}><path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5" /></svg>
export const ArrowUpRight = (p) => <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
export const ArrowDownRight = (p) => <svg {...base} {...p}><path d="M7 7l10 10M17 8v9H8" /></svg>
export const ArrowRight = (p) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const Trash = (p) => <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
export const Download = (p) => <svg {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
export const Upload = (p) => <svg {...base} {...p}><path d="M12 20V9M7 14l5-5 5 5M5 4h14" /></svg>
export const Archive = (p) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="5" rx="1.5" /><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4" /></svg>
export const Wand = (p) => <svg {...base} {...p}><path d="m14 7 3 3M5 19 17.5 6.5a1.5 1.5 0 0 1 2 2L7 21M19 14v4M21 16h-4M8 3v3M9.5 4.5h-3" /></svg>
export const Phone = (p) => <svg {...base} {...p}><rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M11 18.5h2" /></svg>
export const Check = (p) => <svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>
export const Compass = (p) => <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
