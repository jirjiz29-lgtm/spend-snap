# 💰 SpendSnap — Expense Tracker with Summary

> Log it in 5 seconds. Understand your month in 1 glance.

SpendSnap is a tiny, private expense tracker. Add an expense and instantly see a clear monthly summary — total spent, daily average, top category, a category chart and a one-line insight.

**Live demo:** _add your Vercel/Netlify link here_

## Features
- **Installable PWA** — add to home screen, opens full-screen, **works offline** (service worker precaches the whole build). Home-screen shortcut: *Add expense*.
- **Mobile-first** — bottom-sheet add/edit, big thumb-friendly amount entry, one-tap category grid, Today/Yesterday chips, floating add button, safe-area aware.
- **Monthly summary** — total, change vs previous month, daily average, count, biggest expense and a one-line insight.
- **Daily spending chart** + **category breakdown** (stacked bar + list), colour-coded.
- **Sortable activity** — newest, oldest, highest, lowest, or by category (grouped with subtotals). Search notes/amounts, filter by category. Sort choice is remembered.
- **Undo** deletes from the toast.
- **Your data** — CSV export per month, full JSON backup and restore (merges safely), demo data, delete all.
- **Light & dark** — follows the system theme. Currency: INR, USD, EUR, GBP.
- **Private** — `localStorage` only. No account, no server.

## Tech stack
React 18 · Vite 6 · Tailwind CSS v4 · React Router 6 · Vitest · Geist font · hand-written service worker (no chart or PWA libraries)

## Run locally
```bash
npm install
npm run dev       # http://localhost:5173
npm test          # unit tests for summary, validation, storage, CSV
npm run build     # production build in dist/ (includes sw.js)
npm run preview   # test PWA install + offline at http://localhost:4173
```

## Project structure
```
src/
  pages/        Landing.jsx, Tracker.jsx
  components/   Sheet, ExpenseForm, ExpenseList, ExpenseItem, SummaryHero, DailyChart, CategoryBreakdown, MonthSwitcher, SettingsPanel, Toast…
  hooks/        useExpenses, useSettings, useToast, useInstallPrompt, useDocumentTitle
  utils/        summary.js (pure), sort.js, backup.js, validation.js, format.js, storage.js, csv.js, download.js, demo.js (+ *.test.js)
  pwa.js        service-worker registration + install prompt
  sw.js         service-worker template (filled in at build time)
  constants/    categories.js
```

## Deploy
- **Vercel:** import the repo — `vercel.json` already rewrites all routes to `index.html` so `/app` works on refresh.
- **Netlify:** build `npm run build`, publish `dist` — `public/_redirects` handles the SPA rewrite.

## How Claude Code was used
- **Project structure** — scaffolded Vite + Tailwind + Router and the folder layout from the master plan.
- **Code generation** — summary utilities as pure functions, the `useExpenses` hook, all UI components.
- **Testing** — 50 Vitest tests (summary, sorting/grouping, backup, validation, storage, CSV) covering empty months, month boundaries, floating-point sums, corrupted storage and CSV escaping.
- **Error fixing** — Tailwind v4 rejects `@apply` of custom classes (`Cannot apply unknown utility class 'btn'`); fixed by inlining the shared button styles.
- **UI improvement** — browser screenshots at 1280px and 360px exposed truncated cards, double checkmarks and premature validation errors, all fixed.

See [BUILD_LOG.md](BUILD_LOG.md) for the phase-by-phase log.
