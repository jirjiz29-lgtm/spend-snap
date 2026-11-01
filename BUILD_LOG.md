# Build log — SpendSnap with Claude Code

| Phase | What I asked Claude Code | What it did | What I changed / learned |
|---|---|---|---|
| 0 | Set up React + Vite + Tailwind + Router from the master plan | Created project, folder structure, `CLAUDE.md`, routes `/` and `/app` | — |
| 1 | Build the landing page | Navbar, hero, problem→solution, 3 steps, 4 features, live HTML preview mock, final CTA, footer | Preview is pure HTML/CSS (no screenshot needed) |
| 2 | Add / list / edit / delete with localStorage | `useExpenses` hook, `ExpenseForm` (reused for inline edit), `ExpenseList`, `ExpenseItem`, `EmptyState` | Storage loader sanitises bad records instead of crashing |
| 3 | Summary utils + tests, cards, chart, month filter | Pure functions in `summary.js`, Vitest tests, `SummaryCards`, Recharts donut, insight line | Sums in integer cents; dates kept as local strings to avoid UTC shifts |
| 4 | UI polish | Currency selector, toasts, keyboard flow, demo data, favicon, page titles | Screenshots revealed truncation + duplicate ✓ in toast — fixed |
| 5 | Extras | CSV export (formula-injection safe), vs-previous-month, search + category filter, clear all | — |
| 6 | Run tests + build, audit edge cases | Fixed Tailwind v4 `@apply` error; lazy-loaded tracker to remove >500 kB chunk warning; headless-browser test of add/validate/reload/mobile | Blur on an empty field no longer shows an error |
| 7 | Prepare deploy | `vercel.json` + `public/_redirects`, README | — |
| 9 | Make it mobile-first, sortable, a PWA, and less generic | Redesigned around tokens (paper/ink/lime, dark mode, Geist); bottom-sheet add/edit; day-grouped list with 5 sorts + search + category chips; undo delete; JSON backup/restore; manifest, icons, build-generated service worker | Dropped Recharts (−375 kB) for div-based charts; verified offline load + install in headless Chrome |
| 10 | Hide install prompts once installed; step-by-step guide for new users | Persistent install detection; spotlight guided tour (10 steps, keyboard + Back/Skip, optional sample data removed by “Start fresh”), replay from Settings | Install step must never block “Next” — found in browser test |
