'use client'

import { PM_ROUNDS, CONFIDENCE_LEVELS } from '@/lib/pm-config'

interface RawEntry { round: string; confidence: number; feedback_tags: string }

export default function Heatmap({ entries, onJump }: { entries: RawEntry[]; onJump: (round: string) => void }) {
  // For each round: count of entries, best confidence, avg confidence
  const stats = PM_ROUNDS.map(r => {
    const es = entries.filter(e => e.round === r.id)
    const best = es.length ? Math.max(...es.map(e => e.confidence)) : 0
    const avg = es.length ? es.reduce((s, e) => s + e.confidence, 0) / es.length : 0
    return { round: r, count: es.length, best, avg }
  })

  const cellColor = (level: number) => {
    if (level === 0) return { bg: 'var(--bg-surface)', fg: 'var(--text-dim)', label: '—' }
    const c = CONFIDENCE_LEVELS.find(x => x.v === Math.round(level)) ?? CONFIDENCE_LEVELS[0]
    return { bg: c.color, fg: '#05070b', label: c.label }
  }

  const readyCount = stats.filter(s => s.best >= 4).length

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Performance Heatmap</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mock-interview readiness across all 7 rounds</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>{readyCount}/7</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>interview ready</div>
        </div>
      </div>

      {/* Round cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {stats.map(s => {
          const c = cellColor(s.best)
          return (
            <button key={s.round.id} onClick={() => onJump(s.round.id)} style={{
              padding: '12px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
              background: s.best === 0 ? 'var(--bg-surface)' : c.bg + '22',
              border: `1px solid ${s.best === 0 ? 'var(--border)' : c.bg + '66'}`,
            }}>
              <div style={{ fontSize: 18 }}>{s.round.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0', minHeight: 26, lineHeight: 1.2 }}>{s.round.short}</div>
              <div style={{
                fontSize: 9, fontWeight: 700, padding: '2px 4px', borderRadius: 3,
                background: s.best === 0 ? 'transparent' : c.bg, color: s.best === 0 ? 'var(--text-dim)' : c.fg,
              }}>{c.label}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{s.count} {s.count === 1 ? 'entry' : 'entries'}</div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        {CONFIDENCE_LEVELS.map(c => (
          <div key={c.v} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color }} />{c.label}
          </div>
        ))}
      </div>
    </div>
  )
}
