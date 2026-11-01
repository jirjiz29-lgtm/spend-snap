import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'

// The tracker pulls in Recharts; load it only when the user opens the app.
const Tracker = lazy(() => import('./pages/Tracker.jsx'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Tracker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
