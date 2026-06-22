'use client'

import { useEffect, useState } from 'react'
import { APTITUDE_CATEGORIES } from '@/lib/foundation-config'
import { inp, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Log {
  id: number; log_date: string; category: string; count: number; correct: number; minutes: number; notes: string
}

export default function AptitudeTracker() {
  const [logs, setLogs] = useState<Log[]>([])
  const [adding, setAdding] = useState(false)

  function load() { fetch('/api/aptitude').then(r => r.json()).then(setLogs) }
  useEffect(load, [])

  async function save(l: Partial<Log>) {
    await fetch('/api/aptitude', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(l) })
    setAdding(false); load()
  }
  async function del(id: number) { await fetch(`/api/aptitude?id=${id}`, { method: 'DELETE' }); load() }

  // Stats
  const totalProblems = logs.reduce((s, l) => s + l.count, 0)
  const totalCorrect = logs.reduce((s, l) => s + l.correct, 0)
  const overallAcc = totalProblems ? Math.round((totalCorrect / totalProblems) * 100) : 0
  const totalMins = logs.reduce((s, l) => s + l.minutes, 0)
  const streak = computeStreak(logs.map(l => l.log_date))

  // Last 14 days heatmap
  const days = lastNDates(14)
  const byDate: Record<string, number> = {}
  logs.forEach(l => { byDate[l.log_date] = (byDate[l.log_date] ?? 0) + l.count })
  const maxDay = Math.max(1, ...Object.values(byDate))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label}>Daily probability · statistics · logic puzzle practice</div>
        <button onClick={() => setAdding(true)} style={btnPrimary}>+ Log Session</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <Kpi label="Problems Solved" value={String(totalProblems)} color="#3b82f6" />
        <Kpi label="Accuracy" value={totalProblems ? overallAcc + '%' : '—'} color={overallAcc >= 75 ? '#00d4aa' : '#f59e0b'} />
        <Kpi label="Day Streak" value={streak + 'd'} color="#f59e0b" />
        <Kpi label="Time Invested" value={fmtMins(totalMins)} color="#8b5cf6" />
      </div>

      {/* 14-day activity */}
      <div className="card" style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ ...label, marginBottom: 10 }}>Last 14 Days</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {days.map(d => {
            const n = byDate[d] ?? 0
            const intensity = n === 0 ? 0 : 0.25 + 0.75 * (n / maxDay)
            return (
              <div key={d} title={`${d}: ${n} problems`} style={{ flex: 1 }}>
                <div style={{ height: 32, borderRadius: 3, background: n === 0 ? 'var(--bg-elevated)' : `rgba(0, 212, 170, ${intensity})`, border: '1px solid var(--border)' }} />
                <div style={{ fontSize: 8, color: 'var(--text-dim)', textAlign: 'center', marginTop: 2 }}>{d.slice(8)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-category accuracy */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ ...label, marginBottom: 12 }}>Accuracy by Category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {APTITUDE_CATEGORIES.map(cat => {
            const cl = logs.filter(l => l.category === cat.id)
            const att = cl.reduce((s, l) => s + l.count, 0)
            const cor = cl.reduce((s, l) => s + l.correct, 0)
            const acc = att ? Math.round((cor / att) * 100) : 0
            return (
              <div key={cat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: cat.color, fontWeight: 600 }}>{cat.id}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{att ? `${cor}/${att} · ${acc}%` : 'no data'}</span>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${acc}%`, height: '100%', background: cat.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent log */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.8fr 0.8fr 0.8fr 2fr 40px', gap: 8, padding: '8px 14px', background: 'var(--bg-elevated)', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <span>Date</span><span>Category</span><span>Solved</span><span>Correct</span><span>Mins</span><span>Notes</span><span></span>
        </div>
        {logs.map(l => {
          const cat = APTITUDE_CATEGORIES.find(c => c.id === l.category)
          return (
            <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.8fr 0.8fr 0.8fr 2fr 40px', gap: 8, padding: '7px 14px', borderTop: '1px solid var(--border)', alignItems: 'center', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>{l.log_date}</span>
              <span style={{ color: cat?.color, fontWeight: 600 }}>{l.category}</span>
              <span>{l.count}</span>
              <span style={{ color: '#00d4aa' }}>{l.correct}</span>
              <span style={{ color: 'var(--text-muted)' }}>{l.minutes}</span>
              <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.notes}</span>
              <button onClick={() => del(l.id)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: 14 }}>×</button>
            </div>
          )
        })}
        {logs.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No sessions logged yet.</div>}
      </div>

      {adding && <LogEditor onSave={save} onCancel={() => setAdding(false)} />}
    </div>
  )
}

function LogEditor({ onSave, onCancel }: { onSave: (l: Partial<Log>) => void; onCancel: () => void }) {
  const [l, setL] = useState<Partial<Log>>({ log_date: new Date().toISOString().split('T')[0], category: 'Probability', count: 0, correct: 0, minutes: 0 })
  const set = (k: keyof Log, v: unknown) => setL(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={{ ...modal, maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Log Practice Session</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field l="Date"><input type="date" style={inp} value={l.log_date} onChange={e => set('log_date', e.target.value)} /></Field>
          <Field l="Category">
            <select style={inp} value={l.category} onChange={e => set('category', e.target.value)}>
              {APTITUDE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </Field>
          <Field l="Problems Solved"><input type="number" style={inp} value={l.count || ''} onChange={e => set('count', +e.target.value)} /></Field>
          <Field l="Correct"><input type="number" style={inp} value={l.correct || ''} onChange={e => set('correct', +e.target.value)} /></Field>
          <Field l="Minutes"><input type="number" style={inp} value={l.minutes || ''} onChange={e => set('minutes', +e.target.value)} /></Field>
        </div>
        <div style={{ height: 10 }} />
        <Field l="Notes"><input style={inp} value={l.notes ?? ''} placeholder="Topics, weak spots..." onChange={e => set('notes', e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(l)} style={btnPrimary}>Save Session</button>
        </div>
      </div>
    </div>
  )
}

function Kpi({ label: l, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 5 }}>{l}</div>
    </div>
  )
}
function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}

function lastNDates(n: number): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    out.push(d.toISOString().split('T')[0])
  }
  return out
}
function computeStreak(dates: string[]): number {
  const set = new Set(dates)
  let streak = 0
  const d = new Date()
  // allow today or yesterday to start the streak
  if (!set.has(d.toISOString().split('T')[0])) d.setDate(d.getDate() - 1)
  while (set.has(d.toISOString().split('T')[0])) { streak++; d.setDate(d.getDate() - 1) }
  return streak
}
function fmtMins(m: number): string { return m >= 60 ? `${(m / 60).toFixed(1)}h` : `${m}m` }
