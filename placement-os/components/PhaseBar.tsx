'use client'

import { PhaseInfo } from '@/lib/types'

const PHASE_COLORS: Record<string, string> = {
  phase1: '#3b82f6',
  phase2: '#00d4aa',
  post: '#f59e0b',
}

export default function PhaseBar({ info }: { info: PhaseInfo }) {
  const color = PHASE_COLORS[info.phase]
  return (
    <div className="card p-4" style={{ borderColor: color + '40' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="terminal-label mb-1">Current Phase</div>
          <div style={{ color, fontWeight: 700, fontSize: 15 }}>{info.label}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{info.description}</div>
        </div>
        <div className="text-right">
          <div style={{ color, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{info.daysRemaining}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>days left</div>
        </div>
      </div>
      <div style={{ background: '#1e2a3a', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{
          width: `${info.progressPercent}%`, height: '100%',
          background: color, borderRadius: 4,
          transition: 'width 0.5s ease',
          boxShadow: `0 0 8px ${color}60`,
        }} />
      </div>
      <div className="flex justify-between mt-1" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
        <span>Day {info.daysElapsed}</span>
        <span>{info.progressPercent}%</span>
        <span>Day {info.totalDays}</span>
      </div>
    </div>
  )
}
