'use client'

import Sidebar from '@/components/Sidebar'
import { ModuleHeader } from '@/components/foundation/ui'
import CompanyKanban from '@/components/foundation/CompanyKanban'

export default function CompaniesPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/companies" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ModuleHeader icon="🏢" title="Company Tiering Matrix" sub="Map campus placement list into Day 1 / Day 2 / Day 3 buckets" color="#00d4aa" />
        <div style={{ padding: 24 }}>
          <CompanyKanban />
        </div>
      </div>
    </div>
  )
}
