import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const STATIC_FILES = [
  '/',
  '/app',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png',
]

// Emits dist/sw.js with every built file precached, so the app works offline after the first visit.
function serviceWorker() {
  return {
    name: 'spendsnap-service-worker',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const built = Object.keys(bundle).filter((f) => f !== 'index.html' && !f.endsWith('.map'))
      const precache = [...STATIC_FILES, ...built.map((f) => `/${f}`)]
      const version = createHash('sha256').update(precache.join('\n')).digest('hex').slice(0, 10)
      const source = readFileSync(new URL('./src/sw.js', import.meta.url), 'utf8')
        .replace('__VERSION__', version)
        .replace('__PRECACHE__', JSON.stringify(precache, null, 2))
      this.emitFile({ type: 'asset', fileName: 'sw.js', source })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serviceWorker()],
  test: {
    environment: 'node',
  },
})
