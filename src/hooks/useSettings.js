import { useEffect, useState } from 'react'
import { loadSettings, saveSettings } from '../utils/storage.js'

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  return [settings, updateSettings]
}
