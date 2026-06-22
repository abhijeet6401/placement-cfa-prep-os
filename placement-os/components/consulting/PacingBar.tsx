'use client'

import { useEffect, useState } from 'react'

interface Props { cases: { case_date: string }[] }

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Monday = 0
  x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - day)
  return x
}

export default function PacingBar({ cases }: Props) {
  const [target, setTarget] = useState(10)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    fetch('/api/consulting/settings').then(r => r.json()).then(d => setTarget(parseInt(d.weekly_target) || 10))
  }, [])

  async function saveTarget(v: number) {
    setTarget(v); setEditing(false)
    await fetch('/api/consulting/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'weekly_target', value: v }) })
  }

  const weekStart = startOfWeek(new Date())
  const thisWeek = cases.filter(c => new Date(c.case_date) >= weekStart).length
  const pct = Math.min(100, (thisWeek / target) * 100)
  const color = pct >= 100 ? '#00d4aa' : pct >= 50 ? '#3b82f6' : '#f59e0b'

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Practice Pacing · This Week</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Target:{' '}
          {editing ? (
            <input type="number" autoFocus defaultValue={target} onBlur={e => saveTarget(parseInt(e.target.value) || target)}
              onKeyDown={e => { if (e.key === 'Enter') saveTarget(parseInt((e.target as HTMLInputElement).value) || target) }}
              style={{ width: 44, background: 'var(--bg-surface)', border: '1px solid var(--border-bright)', borderRadius: 3, color: 'var(--text-primary)', padding: '1px 4px', fontSize: 11 }} />
          ) : (
            <button onClick={() => setEditing(true)} style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>{target} ✎</button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, whiteSpace: 'nowrap' }}>{thisWeek}<span style={{ fontSize: 16, color: 'var(--text-dim)' }}>/{target}</span></div>
        <div style={{ flex: 1 }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 5, height: 10, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.4s', boxShadow: `0 0 8px ${color}60` }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            {thisWeek >= target ? '🎯 Weekly target hit — keep the streak' : `${target - thisWeek} more cases to hit your weekly target`}
          </div>
        </div>
      </div>
    </div>
  )
}
