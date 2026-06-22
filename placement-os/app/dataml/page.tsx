'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SkillMastery from '@/components/dataml/SkillMastery'
import ProjectPortfolio from '@/components/dataml/ProjectPortfolio'
import ApplicationBoard from '@/components/dataml/ApplicationBoard'
import CompanyResearch from '@/components/dataml/CompanyResearch'

const TABS = [
  { id: 'skills',   label: '🧠 Skill Mastery',   sub: 'DSA · SQL · ML · GenAI · Stats' },
  { id: 'projects', label: '🚀 Project Portfolio', sub: 'CV-ready end-to-end work' },
  { id: 'pipeline', label: '📋 CDC Pipeline',     sub: 'Application Kanban board' },
  { id: 'research', label: '🔬 Company Research',  sub: 'AI initiatives & past Qs' },
]

export default function DataMLPage() {
  const [tab, setTab] = useState('skills')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/dataml" />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔷</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#60a5fa' }}>Data · ML · GenAI Track</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Skill mastery · project portfolio · placement pipeline · company research</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {TABS.map(t => {
              const active = tab === t.id
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '12px 14px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                  background: active ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: `1px solid ${active ? '#3b82f660' : 'var(--border)'}`,
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: active ? '#60a5fa' : 'var(--text-primary)' }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{t.sub}</div>
                </button>
              )
            })}
          </div>

          {tab === 'skills'   && <SkillMastery />}
          {tab === 'projects' && <ProjectPortfolio />}
          {tab === 'pipeline' && <ApplicationBoard />}
          {tab === 'research' && <CompanyResearch />}
        </div>
      </div>
    </div>
  )
}
