'use client'

import { useCallback, useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { PM_ROUNDS } from '@/lib/pm-config'
import RoundView from '@/components/pm/RoundView'
import Heatmap from '@/components/pm/Heatmap'
import FeedbackPanel from '@/components/pm/FeedbackPanel'

interface RawEntry { id: number; round: string; title: string; confidence: number; feedback: string; feedback_tags: string }

type View = 'overview' | string

export default function PMPage() {
  const [view, setView] = useState<View>('overview')
  const [allEntries, setAllEntries] = useState<RawEntry[]>([])

  const loadAll = useCallback(() => {
    fetch('/api/pm').then(r => r.json()).then(setAllEntries)
  }, [])
  useEffect(loadAll, [loadAll])

  const activeRound = PM_ROUNDS.find(r => r.id === view)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/pm" />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#a78bfa' }}>Product Management (APM / TPM)</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>7 interview-round trackers · heatmap · feedback analytics</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            <Tab label="📋 Overview" active={view === 'overview'} color="#a78bfa" onClick={() => setView('overview')} />
            {PM_ROUNDS.map(r => (
              <Tab key={r.id} label={`${r.icon} ${r.short}`} active={view === r.id} color={r.color} onClick={() => setView(r.id)} />
            ))}
          </div>

          {/* Content */}
          {view === 'overview' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Heatmap entries={allEntries} onJump={setView} />
              <FeedbackPanel entries={allEntries} onJump={setView} />
            </div>
          ) : activeRound ? (
            <RoundView round={activeRound} onChanged={loadAll} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Tab({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
      background: active ? color + '20' : 'var(--bg-surface)',
      border: `1px solid ${active ? color + '60' : 'var(--border)'}`,
      color: active ? color : 'var(--text-muted)',
    }}>{label}</button>
  )
}
