// Service worker registration + install state.
// Runs at startup so the browser's install prompt isn't missed before the lazy-loaded tracker mounts.
const INSTALLED_KEY = 'spendsnap_installed'

let state = { prompt: null, installed: false }
const listeners = new Set()

function setState(patch) {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn())
}

function rememberInstalled(value) {
  try {
    if (value) localStorage.setItem(INSTALLED_KEY, '1')
    else localStorage.removeItem(INSTALLED_KEY)
  } catch {
    // storage unavailable — install state just won't persist
  }
}

function wasInstalled() {
  try {
    return localStorage.getItem(INSTALLED_KEY) === '1'
  } catch {
    return false
  }
}

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

export function initPWA() {
  state = { prompt: null, installed: isStandalone() || wasInstalled() }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    // Browsers only offer this when the app is NOT installed, so any remembered install is stale.
    rememberInstalled(false)
    setState({ prompt: event, installed: isStandalone() })
  })
  window.addEventListener('appinstalled', () => {
    rememberInstalled(true)
    setState({ prompt: null, installed: true })
  })

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
  }
}

export const getPWAState = () => state

export function subscribePWA(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export async function promptInstall() {
  const { prompt } = state
  if (!prompt) return false
  prompt.prompt()
  const { outcome } = await prompt.userChoice
  const accepted = outcome === 'accepted'
  if (accepted) rememberInstalled(true)
  setState({ prompt: null, installed: state.installed || accepted })
  return accepted
}
