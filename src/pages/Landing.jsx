import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import CategoryBreakdown from '../components/CategoryBreakdown.jsx'
import DailyChart from '../components/DailyChart.jsx'
import { ArrowRight, Check, Logo } from '../components/Icons.jsx'
import SummaryHero from '../components/SummaryHero.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useInstallPrompt } from '../hooks/useInstallPrompt.js'
import { makeDemoExpenses } from '../utils/demo.js'
import { formatCurrency, monthKey, shiftMonth } from '../utils/format.js'
import { filterByMonth, getSummary } from '../utils/summary.js'

const STEPS = [
  ['Log it', 'Amount, a tap on a category, done. Today’s date is already filled in.'],
  ['See the month', 'Your total, daily rhythm and category split update the moment you save.'],
  ['Adjust', 'Spot the category that crept up, compare with last month, spend on purpose.'],
]

const DETAILS = [
  ['Works offline', 'Installs to your home screen and opens instantly — on the bus, on a plane, anywhere.'],
  ['Private by design', 'No account, no server. Your expenses never leave the device you typed them on.'],
  ['Sort, search, filter', 'Newest, oldest, biggest, by category — and search across notes and amounts.'],
  ['Yours to keep', 'Export any month to CSV, or back up everything to a file and restore it later.'],
  ['Light and dark', 'Follows your system theme. Comfortable at midnight, readable in daylight.'],
  ['Undo, not “Are you sure?”', 'Delete with one tap and take it back from the toast if you didn’t mean it.'],
]

const fmt = (n) => formatCurrency(n, 'INR')

/** A live render of the real app components with sample data — not a screenshot. */
function PhonePreview() {
  const month = shiftMonth(monthKey(), -1)
  const { summary, monthly } = useMemo(() => {
    const all = makeDemoExpenses()
    return { summary: getSummary(all, month), monthly: filterByMonth(all, month) }
  }, [month])

  return (
    <div className="relative mx-auto w-full max-w-[372px]" aria-hidden="true">
      <div className="pointer-events-none rounded-[48px] border border-line bg-surface p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.35)]">
        <div className="overflow-hidden rounded-[40px] bg-bg">
          <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-semibold">
            <span>9:41</span>
            <span className="h-5 w-20 rounded-full bg-ink" />
            <span>100%</span>
          </div>
          <div className="space-y-3 px-3 pb-5 [&_section]:rounded-[24px]">
            <SummaryHero summary={summary} fmt={fmt} />
            <DailyChart expenses={monthly} month={month} fmt={fmt} />
            <div className="max-h-[200px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
              <CategoryBreakdown summary={summary} fmt={fmt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  useDocumentTitle('SpendSnap — Know where your money went')
  const { canInstall, install, installed } = useInstallPrompt()

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 pt-[env(safe-area-inset-top)] sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="text-[17px] font-semibold tracking-tight">SpendSnap</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a href="#how" className="hidden rounded-full px-4 py-2 text-sm text-ink-2 hover:text-ink sm:block">How it works</a>
          <a href="#install" className="hidden rounded-full px-4 py-2 text-sm text-ink-2 hover:text-ink sm:block">Install</a>
          <Link to="/app" className="btn-primary h-10 px-5 text-sm">Open app</Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20 lg:pb-28">
          <div>
            <p className="eyebrow">Expense tracker · works offline</p>
            <h1 className="mt-5 text-[44px] leading-[0.98] font-semibold tracking-[-0.045em] sm:text-[64px] lg:text-[76px]">
              Know where your money <span className="text-muted">actually</span> went.
            </h1>
            <p className="mt-6 max-w-[30rem] text-lg leading-relaxed text-ink-2">
              Log an expense in five seconds. SpendSnap turns it into a clear picture of your month — the total, the daily rhythm, and where the biggest share goes.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/app" className="btn-primary px-7">
                Start tracking <ArrowRight className="h-4 w-4" />
              </Link>
              {canInstall && !installed ? (
                <button className="btn-secondary" onClick={install}>Install the app</button>
              ) : (
                <a href="#install" className="btn-secondary">Get it on your phone</a>
              )}
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {['No sign-up', 'Data stays on your device', 'Free'].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-ink" /> {t}</li>
              ))}
            </ul>
          </div>
          <PhonePreview />
        </section>

        <section id="how" className="scroll-mt-8 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <h2 className="max-w-md text-[32px] leading-tight font-semibold tracking-[-0.03em] sm:text-[40px]">
              Three steps. No spreadsheets.
            </h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="border-t border-ink pt-5">
                  <span className="text-sm text-muted tabular-nums">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-ink-2">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_2fr] lg:py-28">
            <h2 className="max-w-sm text-[32px] leading-tight font-semibold tracking-[-0.03em] sm:text-[40px]">
              Small app. Careful details.
            </h2>
            <dl className="grid gap-x-10 sm:grid-cols-2">
              {DETAILS.map(([title, text]) => (
                <div key={title} className="border-t border-line py-5">
                  <dt className="font-semibold tracking-tight">{title}</dt>
                  <dd className="mt-1.5 text-[15px] text-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="install" className="scroll-mt-8 px-3 pb-6 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 rounded-[36px] bg-hero px-6 py-14 text-on-hero sm:px-12 lg:grid-cols-2 lg:items-end lg:py-20">
            <div>
              <h2 className="text-[36px] leading-[1.02] font-semibold tracking-[-0.04em] sm:text-[52px]">
                Put it on your <span className="text-accent">home screen.</span>
              </h2>
              <p className="mt-5 max-w-md text-hero-muted">
                SpendSnap installs like a native app — full-screen, its own icon, and it keeps working without a connection.
              </p>
            </div>
            <div className="space-y-5">
              <ol className="space-y-3 text-[15px]">
                <li className="flex gap-3"><span className="text-hero-muted tabular-nums">iPhone</span> Safari → Share → Add to Home Screen</li>
                <li className="flex gap-3"><span className="text-hero-muted tabular-nums">Android</span> Chrome menu → Install app</li>
                <li className="flex gap-3"><span className="text-hero-muted tabular-nums">Desktop</span> Install icon in the address bar</li>
              </ol>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/app" className="btn-accent px-7">Open SpendSnap <ArrowRight className="h-4 w-4" /></Link>
                {canInstall && !installed && (
                  <button className="inline-flex h-12 items-center rounded-full border border-hero-line px-6 text-[15px] font-medium transition hover:bg-white/5" onClick={install}>Install now</button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 pb-[calc(env(safe-area-inset-bottom)+40px)] text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} SpendSnap</p>
        <p>Your data stays in your browser.</p>
      </footer>
    </div>
  )
}
