'use client'

import { TrackWeights } from '@/lib/types'

const TRACKS = [
  { key: 'dataml',     label: 'Data / ML / GenAI', color: '#3b82f6' },
  { key: 'consulting', label: 'Consulting',         color: '#00d4aa' },
  { key: 'finance',    label: 'Finance / CFA',      color: '#f59e0b' },
  { key: 'pm',         label: 'Product Mgmt',       color: '#8b5cf6' },
] as const

interface Props {
  weights: TrackWeights
  allocatedHours: Record<string, number>
  capacity: number
}

export default function TrackAllocation({ weights, allocatedHours, capacity }: Props) {
  return (
    <div className="card p-4">
      <div className="terminal-label mb-3">Today&apos;s Track Allocation</div>
      <div className="flex flex-col gap-2">
        {TRACKS.map(t => {
          const hrs = allocatedHours[t.key] ?? 0
          const pct = weights[t.key as keyof TrackWeights] * 100
          return (
            <div key={t.key}>
              <div className="flex justify-between mb-1" style={{ fontSize: 12 }}>
                <span style={{ color: t.color, fontWeight: 600 }}>{t.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{hrs}h · {Math.round(pct)}%</span>
              </div>
              <div style={{ background: '#1e2a3a', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: t.color, borderRadius: 3,
                  boxShadow: `0 0 6px ${t.color}50`,
                }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
        Total capacity today: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{capacity}h</span>
      </div>
    </div>
  )
}
