'use client'

import { useEffect, useState } from 'react'
import { PIPELINE_STAGES, ROLE_FOCUS, TARGET_DAYS } from '@/lib/dataml-config'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface App {
  id: number; company: string; role_focus: string; target_day: string;
  status: string; requirements: string
}
function empty(): App { return { id: 0, company: '', role_focus: 'Data Analyst', target_day: 'Day 1', status: 'cv_verification', requirements: '' } }

const DAY_COLOR: Record<string, string> = { 'Day 1': '#00d4aa', 'Day 2': '#3b82f6', 'Day 3': '#f59e0b', 'Off-campus': '#8b5cf6' }

export default function ApplicationBoard() {
  const [apps, setApps] = useState<App[]>([])
  const [editing, setEditing] = useState<App | null>(null)

  function load() { fetch('/api/dataml/applications').then(r => r.json()).then(setApps) }
  useEffect(load, [])

  async function save(a: App) {
    await fetch('/api/dataml/applications', { method: a.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a) })
    setEditing(null); load()
  }
  async function move(a: App, dir: 1 | -1) {
    const idx = PIPELINE_STAGES.findIndex(s => s.id === a.status)
    const next = PIPELINE_STAGES[idx + dir]
    if (!next) return
    const updated = { ...a, status: next.id }
    setApps(prev => prev.map(x => x.id === a.id ? updated : x))
    await fetch('/api/dataml/applications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
  }
  async function del(id: number) { if (!confirm('Delete application?')) return; await fetch(`/api/dataml/applications?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label}>{apps.length} applications · CDC placement pipeline</div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Company</button>
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, minmax(165px, 1fr))`, gap: 10, overflowX: 'auto' }}>
        {PIPELINE_STAGES.map(stage => {
          const items = apps.filter(a => a.status === stage.id)
          return (
            <div key={stage.id} style={{ minWidth: 165 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${stage.color}` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stage.label}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto', background: 'var(--bg-elevated)', borderRadius: 8, padding: '0 6px' }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 60 }}>
                {items.map(a => {
                  const idx = PIPELINE_STAGES.findIndex(s => s.id === a.status)
                  return (
                    <div key={a.id} className="card" style={{ padding: 10, background: 'var(--bg-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 12 }}>{a.company}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: (DAY_COLOR[a.target_day] ?? '#888') + '20', color: DAY_COLOR[a.target_day] ?? '#888', whiteSpace: 'nowrap', height: 'fit-content' }}>{a.target_day}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#60a5fa', marginTop: 2 }}>{a.role_focus}</div>
                      {a.requirements && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.requirements}</div>}
                      <div style={{ display: 'flex', gap: 3, marginTop: 8, alignItems: 'center' }}>
                        <button disabled={idx === 0} onClick={() => move(a, -1)} style={{ ...arrowBtn, opacity: idx === 0 ? 0.3 : 1 }}>←</button>
                        <button disabled={idx === PIPELINE_STAGES.length - 1} onClick={() => move(a, 1)} style={{ ...arrowBtn, opacity: idx === PIPELINE_STAGES.length - 1 ? 0.3 : 1 }}>→</button>
                        <button onClick={() => setEditing(a)} style={{ ...arrowBtn, marginLeft: 'auto' }}>✎</button>
                        <button onClick={() => del(a.id)} style={{ ...arrowBtn, color: '#f43f5e' }}>×</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {editing && <AppEditor app={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function AppEditor({ app, onSave, onCancel }: { app: App; onSave: (a: App) => void; onCancel: () => void }) {
  const [a, setA] = useState(app)
  const set = (k: keyof App, v: unknown) => setA(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{a.id ? 'Edit' : 'Add'} Application</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field l="Company Name"><input style={inp} value={a.company} placeholder="e.g. Goldman Sachs" onChange={e => set('company', e.target.value)} /></Field>
          <Field l="Role Focus">
            <select style={inp} value={a.role_focus} onChange={e => set('role_focus', e.target.value)}>
              {ROLE_FOCUS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field l="Target Day">
            <select style={inp} value={a.target_day} onChange={e => set('target_day', e.target.value)}>
              {TARGET_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field l="Pipeline Stage">
            <select style={inp} value={a.status} onChange={e => set('status', e.target.value)}>
              {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        </div>
        <Field l="Key Interview Requirements"><textarea style={textarea} value={a.requirements} placeholder="e.g. 'Strong SQL + ML system design, probability puzzles, past: guesstimate + DSA medium'" onChange={e => set('requirements', e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(a)} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
const arrowBtn: React.CSSProperties = { width: 24, height: 22, borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)' }
