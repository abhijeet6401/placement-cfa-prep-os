'use client'

import Sidebar from '@/components/Sidebar'
import { ModuleHeader } from '@/components/foundation/ui'
import AptitudeTracker from '@/components/foundation/AptitudeTracker'

export default function AptitudePage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/aptitude" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ModuleHeader icon="🧩" title="Aptitude & Puzzles" sub="Daily probability, statistics & logic puzzle practice with streaks" color="#00d4aa" />
        <div style={{ padding: 24 }}>
          <AptitudeTracker />
        </div>
      </div>
    </div>
  )
}
