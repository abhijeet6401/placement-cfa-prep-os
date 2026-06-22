'use client'

import { PILLARS } from '@/lib/consulting-config'
import { gradeColor } from './ui'

interface Props {
  // average score per pillar key, 0-5
  averages: Record<string, number>
  // optional: most recent case scores for overlay
  recent?: Record<string, number>
}

export default function RadarChart({ averages, recent }: Props) {
  const size = 240, cx = size / 2, cy = size / 2, R = 88
  const axes = PILLARS
  const n = axes.length
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

  const point = (i: number, value: number) => {
    const r = (value / 5) * R
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))]
  }
  const polygon = (vals: number[]) => vals.map((v, i) => point(i, v).join(',')).join(' ')

  const avgVals = axes.map(a => averages[a.key] ?? 0)
  const recentVals = recent ? axes.map(a => recent[a.key] ?? 0) : null

  const rings = [1, 2, 3, 4, 5]

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <svg width={size} height={size}>
        {/* grid rings */}
        {rings.map(ring => (
          <polygon key={ring}
            points={axes.map((_, i) => point(i, ring).join(',')).join(' ')}
            fill="none" stroke="#1e2a3a" strokeWidth={1}
          />
        ))}
        {/* spokes */}
        {axes.map((_, i) => {
          const [x, y] = point(i, 5)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1e2a3a" strokeWidth={1} />
        })}
        {/* average polygon */}
        <polygon points={polygon(avgVals)} fill="#3b82f633" stroke="#3b82f6" strokeWidth={2} />
        {avgVals.map((v, i) => { const [x, y] = point(i, v); return <circle key={i} cx={x} cy={y} r={3} fill="#3b82f6" /> })}
        {/* recent overlay */}
        {recentVals && (
          <>
            <polygon points={polygon(recentVals)} fill="none" stroke="#00d4aa" strokeWidth={1.5} strokeDasharray="4 3" />
            {recentVals.map((v, i) => { const [x, y] = point(i, v); return <circle key={i} cx={x} cy={y} r={2.5} fill="#00d4aa" /> })}
          </>
        )}
        {/* axis labels */}
        {axes.map((a, i) => {
          const [x, y] = point(i, 6.1)
          return (
            <text key={a.key} x={x} y={y} fontSize={10} fontWeight={600}
              fill="var(--text-muted)" textAnchor="middle" dominantBaseline="middle">
              {a.short}
            </text>
          )
        })}
      </svg>

      {/* Legend / scores */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 12, fontSize: 11 }}>
          <span style={{ color: '#3b82f6' }}>● Average</span>
          {recent && <span style={{ color: '#00d4aa' }}>┄ Most recent</span>}
        </div>
        {axes.map(a => {
          const v = averages[a.key] ?? 0
          return (
            <div key={a.key} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: 'var(--text-primary)' }}>{a.label}</span>
                <span style={{ color: gradeColor(v), fontWeight: 700 }}>{v ? v.toFixed(1) : '—'}/5</span>
              </div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                <div style={{ width: `${(v / 5) * 100}%`, height: '100%', background: gradeColor(v) }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
