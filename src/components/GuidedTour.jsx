import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt.js'
import { Logo } from './Icons.jsx'

const PAD = 8 // space between the highlighted element and the spotlight edge
const GAP = 14 // space between the spotlight and the card
const EDGE = 12 // minimum distance from the viewport edge

/** First matching element that is actually rendered (e.g. the mobile + button is hidden on desktop). */
function findTarget(selectors) {
  for (const sel of [].concat(selectors ?? [])) {
    const el = document.querySelector(sel)
    if (el && el.getClientRects().length) return el
  }
  return null
}

function buildSteps({ installed, canInstall, ios }) {
  return [
    { id: 'welcome' },
    {
      target: ['[data-tour="add-fab"]', '[data-tour="add-btn"]'],
      title: 'Log an expense',
      body: 'Tap + whenever you spend. Type the amount, tap a category, choose Today, Yesterday or any date, add an optional note, then press Add expense.',
    },
    {
      target: '[data-tour="month"]',
      title: 'Switch months',
      body: 'Use the arrows to look back at earlier months. Tap the month name to jump straight back to this month.',
    },
    {
      target: '[data-tour="summary"]',
      title: 'Your month at a glance',
      body: 'The big number is what you’ve spent. The badge compares it with last month (red means more, lime means less). Below: daily average, number of expenses and your biggest one.',
    },
    {
      target: '[data-tour="daily"]',
      title: 'Daily spending',
      body: 'Each bar is one day of the month. Lime is today, the darkest bar is your most expensive day — its amount is shown in the corner.',
    },
    {
      target: '[data-tour="categories"]',
      title: 'Where it went',
      body: 'The coloured bar splits the month by category. The list shows each category’s share and amount, biggest first.',
    },
    {
      target: '[data-tour="sort"]',
      title: 'Sort your list',
      body: 'Newest, oldest, highest or lowest amount — or grouped by category with subtotals. Your choice is remembered.',
    },
    {
      target: '[data-tour="search"]',
      title: 'Search and filter',
      body: 'Search by note, category or amount. Tap a coloured chip to show just that category; tap All to reset.',
    },
    {
      target: '[data-tour="activity-list"] li',
      title: 'Edit or delete',
      body: 'Tap any expense to change its amount, category, date or note. The bin button on that screen deletes it — and if that was a mistake, tap Undo in the message that pops up.',
    },
    {
      target: '[data-tour="settings"]',
      title: 'Settings and your data',
      body: 'Change currency, export a month to CSV, back up everything to a file and restore it on another device, load sample data, or delete all data.',
    },
    {
      id: 'install',
      skip: installed,
      title: 'Install it like an app',
      body: canInstall
        ? 'Add SpendSnap to your home screen. It opens full-screen and keeps working without internet.'
        : ios
          ? 'In Safari, tap the Share button, then “Add to Home Screen”. SpendSnap then opens full-screen and works offline.'
          : 'Open your browser menu and choose “Install app” or “Add to Home screen”. SpendSnap then opens full-screen and works offline.',
    },
    { id: 'finish' },
  ]
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-surface-2 px-4 py-3">
      <span className="text-[15px]">{label}</span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-line transition peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:bg-surface after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  )
}

/**
 * First-run walkthrough. Highlights one element at a time with a spotlight and explains it.
 * Steps whose element isn't on screen (e.g. search when there are no expenses) are skipped.
 */
export default function GuidedTour({ open, hasExpenses, onLoadDemo, onRemoveDemo, onAddExpense, onClose }) {
  const { installed, canInstall, ios, install } = useInstallPrompt()
  const steps = buildSteps({ installed, canInstall, ios })
  const [index, setIndex] = useState(0)
  const [useDemo, setUseDemo] = useState(true)
  const [demoIds, setDemoIds] = useState(null)
  const [rect, setRect] = useState(null)
  const [cardHeight, setCardHeight] = useState(0)
  const cardRef = useRef(null)
  const titleId = useId()

  const step = steps[index]
  const isAvailable = useCallback((s) => !s.skip && (!s.target || Boolean(findTarget(s.target))), [])
  const tourSteps = steps.filter((s) => s.target || s.id === 'install')
  const visible = tourSteps.filter(isAvailable)
  const position = visible.indexOf(step) + 1

  useEffect(() => {
    if (open) {
      setIndex(0)
      setDemoIds(null)
    }
  }, [open])

  // Track the highlighted element every frame so the spotlight follows scrolling and layout changes.
  const target = step.target
  useEffect(() => {
    if (!open) return
    const el = findTarget(target)
    if (!el) {
      setRect(null)
      return
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (getComputedStyle(el).position !== 'fixed') el.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' })
    const radius = parseFloat(getComputedStyle(el).borderRadius) || 12
    let frame
    let last = ''
    const tick = () => {
      const r = el.getBoundingClientRect()
      const key = `${Math.round(r.top)},${Math.round(r.left)},${Math.round(r.width)},${Math.round(r.height)}`
      if (key !== last) {
        last = key
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height, radius })
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
    // `target` is rebuilt every render; the step index is what identifies a new step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index])

  useLayoutEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight)
  })

  const go = useCallback(
    (direction) => {
      let i = index + direction
      while (i > 0 && i < steps.length - 1 && !isAvailable(steps[i])) i += direction
      setIndex(Math.max(0, Math.min(i, steps.length - 1)))
    },
    [index, steps, isAvailable],
  )

  const start = () => {
    if (!hasExpenses && useDemo) setDemoIds(onLoadDemo())
    // Let the sample data render before looking for the next step's element.
    requestAnimationFrame(() => go(1))
  }

  const close = useCallback((reason) => onClose({ reason, demoLoaded: Boolean(demoIds) }), [onClose, demoIds])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close('skip')
      else if (e.key === 'ArrowRight' && step.target) go(1)
      else if (e.key === 'ArrowLeft' && index > 0) go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step, index, go, close])

  if (!open) return null

  // Card placement: centred for intro/outro steps, otherwise on whichever side of the target has more room.
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(380, vw - EDGE * 2)
  let cardStyle = { width, left: (vw - width) / 2, top: Math.max(EDGE, (vh - cardHeight) / 2) }
  if (rect) {
    const below = vh - (rect.top + rect.height + PAD)
    const above = rect.top - PAD
    let top = below >= above ? rect.top + rect.height + PAD + GAP : rect.top - PAD - GAP - cardHeight
    top = Math.min(Math.max(top, EDGE), vh - cardHeight - EDGE)
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, EDGE), vw - width - EDGE)
    cardStyle = { width, left, top }
  }

  const primary = 'btn-primary h-11 px-5 text-sm'
  const secondary = 'btn-secondary h-11 px-4 text-sm'

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      {rect ? (
        <div
          className="pointer-events-none absolute transition-all duration-300 ease-out"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            borderRadius: rect.radius + PAD,
            boxShadow: '0 0 0 2px var(--accent), 0 0 0 9999px rgb(0 0 0 / 0.62)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/60" />
      )}

      <div
        ref={cardRef}
        key={index}
        className="animate-toast absolute rounded-3xl border border-line bg-surface p-5 text-ink shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)]"
        style={cardStyle}
      >
        {step.id === 'welcome' ? (
          <>
            <Logo className="h-11 w-11" />
            <h2 id={titleId} className="mt-4 text-xl font-semibold tracking-tight">Welcome to SpendSnap</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              Take a one-minute tour of everything you can do. You can replay it any time from Settings.
            </p>
            {!hasExpenses && (
              <div className="mt-4">
                <Toggle checked={useDemo} onChange={setUseDemo} label="Fill the app with sample data during the tour" />
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button className={secondary} onClick={() => close('skip')}>Skip</button>
              <button className={primary} onClick={start} autoFocus>Start tour</button>
            </div>
          </>
        ) : step.id === 'finish' ? (
          <>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight">You’re all set</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {demoIds
                ? 'Keep the sample data to explore a bit more, or clear it and log your first real expense.'
                : 'Everything stays private on this device. Tap + to log your next expense.'}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {demoIds ? (
                <>
                  <button className={secondary} onClick={() => close('done')}>Keep sample data</button>
                  <button
                    className={primary}
                    autoFocus
                    onClick={() => {
                      onRemoveDemo(demoIds)
                      onClose({ reason: 'done', demoLoaded: false })
                      onAddExpense()
                    }}
                  >
                    Start fresh
                  </button>
                </>
              ) : (
                <>
                  <button className={secondary} onClick={() => close('done')}>Done</button>
                  <button
                    className={primary}
                    autoFocus
                    onClick={() => {
                      close('done')
                      onAddExpense()
                    }}
                  >
                    Add an expense
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="eyebrow tabular-nums">Step {position} of {visible.length}</p>
              <button className="-mr-1 rounded-full px-2 py-1 text-[13px] text-muted hover:text-ink" onClick={() => close('skip')}>
                Skip tour
              </button>
            </div>
            <h2 id={titleId} className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{step.body}</p>
            {step.id === 'install' && canInstall && (
              <button className="btn-accent mt-4 h-11 w-full text-sm" onClick={async () => { await install(); go(1) }}>
                Install now
              </button>
            )}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                {visible.map((s, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === position - 1 ? 'w-5 bg-ink' : 'w-1.5 bg-line'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button className={secondary} onClick={() => go(-1)}>Back</button>
                <button className={primary} onClick={() => go(1)} autoFocus>
                  {step.id === 'install' && canInstall ? 'Not now' : 'Next'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
