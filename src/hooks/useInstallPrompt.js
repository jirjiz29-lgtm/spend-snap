import { useSyncExternalStore } from 'react'
import { getPWAState, isIOS, promptInstall, subscribePWA } from '../pwa.js'

export function useInstallPrompt() {
  const { prompt, installed } = useSyncExternalStore(subscribePWA, getPWAState)
  return { canInstall: Boolean(prompt) && !installed, install: promptInstall, installed, ios: isIOS() }
}
