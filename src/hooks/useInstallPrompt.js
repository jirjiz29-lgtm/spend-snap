import { useSyncExternalStore } from 'react'
import { getInstallPrompt, isIOS, isStandalone, promptInstall, subscribeInstallPrompt } from '../pwa.js'

export function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribeInstallPrompt, getInstallPrompt)
  return { canInstall: Boolean(prompt), install: promptInstall, installed: isStandalone(), ios: isIOS() }
}
