'use client'

import { useCallback, useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { PILLARS } from '@/lib/consulting-config'
import CaseLog, { CaseRow } from '@/components/consulting/CaseLog'
import GuesstimateEngine from '@/components/consulting/GuesstimateEngine'
import SectorVault from '@/components/consulting/SectorVault'
import PEITracker from '@/components/consulting/PEITracker'
import MacroCheatSheet from '@/components/consulting/MacroCheatSheet'
import RadarChart from '@/components/consulting/RadarChart'
import PacingBar from '@/components/consulting/PacingBar'

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'cases',    label: '🎯 Case Log' },
  { id: 'guess',    label: '🔢 Guesstimates' },
  { id: 'sectors',  label: '🏭 Sector Vault' },
  { id: 'pei',      label: '⭐ PEI / Fit' },
  { id: 'macro',    label: '📈 Macro Cheat Sheet' },
]

export default function ConsultingPage() {
  const [tab, setTab] = useState('overview')
  const [cases, setCases] = useState<CaseRow[]>([])

  const loadCases = useCallback(() => {
    fetch('/api/consulting/cases').then(r => r.json()).then(setCases)
  }, [])
  useEffect(loadCases, [loadCases])

  // Compute radar averages + most recent
  const averages: Record<string, number> = {}
  const recent: Record<string, number> = {}
  PILLARS.forEach(p => {
    const graded = cases.filter(c => (c[p.key] as number) > 0)
    averages[p.key] = graded.length ? graded.reduce((s, c) => s + (c[p.key] as number), 0) / graded.length : 0
  })
  const mostRecent = [...cases].sort((a, b) => b.case_date.localeCompare(a.case_date))[0]
  if (mostRecent) PILLARS.forEach(p => { recent[p.key] = mostRecent[p.key] as number })

  const totalCases = cases.length
  const avgOverall = cases.length
    ? cases.reduce((s, c) => s + (c.g_clarify + c.g_structure + c.g_math + c.g_synth) / 4, 0) / cases.length
    : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/consulting" />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>♟</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#60a5fa' }}>Consulting & Strategy Mastery</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>MBB / Parthenon prep · cases · guesstimates · sectors · PEI · macro</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '7px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === t.id ? '#3b82f620' : 'var(--bg-surface)',
                border: `1px solid ${tab === t.id ? '#3b82f660' : 'var(--border)'}`,
                color: tab === t.id ? '#60a5fa' : 'var(--text-muted)',
              }}>{t.label}</button>
            ))}
          </div>

          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Kpi label="Cases Logged" value={String(totalCases)} color="#60a5fa" />
                <Kpi label="Avg Score" value={avgOverall ? avgOverall.toFixed(1) + '/5' : '—'} color="#00d4aa" />
                <Kpi label="Last Case" value={mostRecent?.case_date ?? '—'} color="#f59e0b" small />
              </div>
              <PacingBar cases={cases} />
              <div className="card" style={{ padding: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>MECE Performance Radar</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Average vs most-recent across the four pillars of casing — spot if math is improving but structuring lags</div>
                {totalCases > 0
                  ? <RadarChart averages={averages} recent={mostRecent ? recent : undefined} />
                  : <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: 30, textAlign: 'center' }}>Log your first case to populate the radar.</div>}
              </div>
            </div>
          )}
          {tab === 'cases'   && <CaseLog onChanged={loadCases} />}
          {tab === 'guess'   && <GuesstimateEngine />}
          {tab === 'sectors' && <SectorVault />}
          {tab === 'pei'     && <PEITracker />}
          {tab === 'macro'   && <MacroCheatSheet />}
        </div>
      </div>
    </div>
  )
}

function Kpi({ label, value, color, small }: { label: string; value: string; color: string; small?: boolean }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: small ? 16 : 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
    </div>
  )
}
