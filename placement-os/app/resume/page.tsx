'use client'

import Sidebar from '@/components/Sidebar'
import { ModuleHeader } from '@/components/foundation/ui'
import ResumeDefense from '@/components/foundation/ResumeDefense'

export default function ResumePage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/resume" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ModuleHeader icon="📄" title="Resume Defense Matrix" sub="Every bullet → expected follow-ups, methodology, quantified impact" color="#00d4aa" />
        <div style={{ padding: 24 }}>
          <ResumeDefense />
        </div>
      </div>
    </div>
  )
}
