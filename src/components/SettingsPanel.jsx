import { useRef } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt.js'
import { CURRENCIES } from '../utils/format.js'
import { Archive, Download, Phone, Trash, Upload, Wand } from './Icons.jsx'

function Row({ icon: Icon, title, text, onClick, danger, disabled }) {
  return (
    <button
      className={`flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-surface-2/60 active:bg-surface-2 disabled:opacity-40 ${danger ? 'text-danger' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{title}</span>
        {text && <span className={`block text-[13px] ${danger ? 'text-danger/80' : 'text-muted'}`}>{text}</span>}
      </span>
    </button>
  )
}

function Group({ title, children }) {
  return (
    <section>
      <h3 className="eyebrow mb-2.5">{title}</h3>
      {children}
    </section>
  )
}

export default function SettingsPanel({ currency, onCurrencyChange, monthLabel, monthCount, totalCount, onExportCSV, onBackup, onRestore, onDemo, onClear }) {
  const fileRef = useRef(null)
  const { canInstall, install, installed, ios } = useInstallPrompt()

  return (
    <div className="space-y-7">
      <Group title="Currency">
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-surface-2 p-1" role="radiogroup" aria-label="Currency">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              role="radio"
              aria-checked={currency === c.code}
              className={`h-10 rounded-xl text-sm font-medium transition ${currency === c.code ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              onClick={() => onCurrencyChange(c.code)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Group>

      {!installed && (
        <Group title="App">
          <div className="flex items-center gap-3.5 rounded-2xl border border-line px-4 py-3.5">
            <Phone className="h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium">Install SpendSnap</p>
              <p className="text-[13px] text-muted">
                {canInstall
                  ? 'Full-screen, works offline, one tap from your home screen.'
                  : ios
                    ? 'In Safari, tap Share, then “Add to Home Screen”.'
                    : 'Use your browser menu → “Install app” or “Add to Home screen”.'}
              </p>
            </div>
            {canInstall && <button className="btn-accent h-10 px-4 text-sm" onClick={install}>Install</button>}
          </div>
        </Group>
      )}

      <Group title="Your data">
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          <Row icon={Download} title={`Export ${monthLabel} as CSV`} text={`${monthCount} expenses · opens in Excel or Sheets`} onClick={onExportCSV} disabled={!monthCount} />
          <Row icon={Archive} title="Back up everything" text={`${totalCount} expenses as a .json file`} onClick={onBackup} disabled={!totalCount} />
          <Row icon={Upload} title="Restore from backup" text="Merges with what’s already here" onClick={() => fileRef.current?.click()} />
          <Row icon={Wand} title="Load demo data" text="Sample expenses across two months" onClick={onDemo} />
          <Row icon={Trash} title="Delete all data" text="Removes every expense from this device" onClick={onClear} disabled={!totalCount} danger />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) onRestore(file)
          }}
        />
      </Group>

      <p className="pb-1 text-center text-xs text-muted">Stored only on this device. Nothing is sent anywhere.</p>
    </div>
  )
}
