# SpendSnap — project context for Claude Code

**Problem:** People don't know where their money goes each month.
**Core feature:** Add expenses → instantly see a monthly summary (total, by category, top spend, daily average).
**Target user:** Students, freelancers, young professionals who find budgeting apps too heavy.

## v1 scope
Single user, browser-only, no login. Data in `localStorage`.
NOT in v1: accounts, bank sync, multi-currency conversion, budgets/alerts.

## Stack
React 18 + Vite 6 · Tailwind CSS v4 (`@tailwindcss/vite`) · React Router 6 · Vitest · Geist (self-hosted via `@fontsource-variable/geist`).
No chart library — charts are plain divs (`DailyChart`, `CategoryBreakdown`).
Routes: `/` Landing, `/app` Tracker (lazy-loaded). `/app?add=1` opens the add sheet (manifest shortcut).

## PWA
- `public/manifest.webmanifest` (start_url `/app`, standalone) + PNG icons in `public/icons/`.
- `src/sw.js` is a **template**: the `serviceWorker()` plugin in `vite.config.js` fills in the version + every built file and emits `dist/sw.js`. Navigations are network-first with cached fallback; assets cache-first.
- SW registers only in production (`src/pwa.js`), which also captures `beforeinstallprompt` for `useInstallPrompt`.
- Install state (`useInstallPrompt`): installed = standalone display mode, or an `appinstalled` event remembered in `spendsnap_installed` (cleared if the browser offers install again). Install CTAs on Landing/Settings/tour hide when installed.
- Test PWA behaviour with `npm run build && npm run preview`, not `npm run dev`.

## Guided tour
`components/GuidedTour.jsx` — shown on first visit to `/app` (flag `spendsnap_tour_done_v1`), replayable from Settings → Help. Steps target elements via `data-tour="…"` attributes; steps whose element isn't rendered are skipped. **When adding a feature, add a `data-tour` anchor and a step.**

## Data model
```js
{ id, amount /* number > 0, 2 dp */, category, date /* "YYYY-MM-DD" local */, note /* ≤ 80 */, createdAt }
```
Categories: Food · Transport · Shopping · Bills · Entertainment · Health · Education · Other (`src/constants/categories.js` — colours shared by badges + chart).
Storage keys: `spendsnap_expenses_v1`, `spendsnap_settings_v1` (currency, sort).
Sorting/grouping: `src/utils/sort.js`. Backup/restore JSON: `src/utils/backup.js` (merges by id).

## Rules
- Summary logic lives in `src/utils/summary.js` as **pure functions** — keep it UI-free and tested.
- Sum money in integer cents (`toCents`) — never add floats directly.
- Dates are local `YYYY-MM-DD` strings; never use `toISOString()` for dates (UTC shift).
- Daily average = total ÷ days elapsed (current month) or ÷ days in month (past months).
- Validation (`src/utils/validation.js`): amount required, > 0, ≤ 2 decimals; category from list; date required, not future; note ≤ 80.
- `loadExpenses()` must never throw — corrupted storage is sanitised.
- Design: warm paper + ink, one lime accent (`--accent`). Use the token colours (`bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-hero`…) from `src/index.css` — never raw Tailwind palette colours — so dark mode keeps working.
- Component classes: `card`, `btn-primary|accent|secondary|icon`, `input`, `chip`, `eyebrow`. Tailwind v4 can't `@apply` a custom class, so shared styles are inlined.
- Avoid: emoji icons, gradient blobs, pill badges, centred icon-card grids. Category glyphs live in `constants/categories.js`.
- Mobile-first: inputs ≥ 16px (no iOS zoom), touch targets ≥ 40px, respect `env(safe-area-inset-*)`. Add/edit/settings use `Sheet` (native `<dialog>`).

## Commands
`npm run dev` · `npm test` · `npm run build` · `npm run preview`
