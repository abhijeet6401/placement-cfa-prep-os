'use client'

import { useEffect, useState } from 'react'
import { SKILL_CATEGORIES, PROFICIENCY } from '@/lib/dataml-config'
import { inp, btnPrimary, btnGhost, label } from './ui'

interface Skill {
  id: number; category: string; topic: string; proficiency: string;
  last_reviewed: string; next_action: string
}

const prof = (p: string) => PROFICIENCY.find(x => x.id === p) ?? PROFICIENCY[0]

export default function SkillMastery() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Skill | null>(null)

  function load() { fetch('/api/dataml/skills').then(r => r.json()).then(setSkills) }
  useEffect(load, [])

  async function add(category: string) {
    await fetch('/api/dataml/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, topic: 'New topic' }) })
    load()
  }
  async function save(s: Skill) {
    await fetch('/api/dataml/skills', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
    setEditId(null); setDraft(null); load()
  }
  async function del(id: number) { await fetch(`/api/dataml/skills?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      {/* Mastery summary */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SKILL_CATEGORIES.length}, 1fr)`, gap: 10, marginBottom: 18 }}>
        {SKILL_CATEGORIES.map(cat => {
          const cs = skills.filter(s => s.category === cat.id)
          const avg = cs.length ? cs.reduce((sum, s) => sum + prof(s.proficiency).pct, 0) / cs.length : 0
          return (
            <div key={cat.id} className="card" style={{ padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, minHeight: 28 }}>{cat.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: cat.color, margin: '4px 0' }}>{Math.round(avg)}%</div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                <div style={{ width: `${avg}%`, height: '100%', background: cat.color }} />
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{cs.length} topics</div>
            </div>
          )
        })}
      </div>

      {/* Per-category tables */}
      {SKILL_CATEGORIES.map(cat => {
        const cs = skills.filter(s => s.category === cat.id)
        return (
          <div key={cat.id} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 3, height: 16, background: cat.color, borderRadius: 2 }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: cat.color }}>{cat.label}</span>
              <button onClick={() => add(cat.id)} style={{ ...btnGhost, fontSize: 11, padding: '2px 9px', marginLeft: 'auto', color: cat.color, borderColor: cat.color + '50' }}>+ Topic</button>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.1fr 2fr 64px', gap: 8, padding: '8px 14px', background: 'var(--bg-elevated)', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Topic</span><span>Proficiency</span><span>Last Reviewed</span><span>Next Action</span><span></span>
              </div>
              {cs.map(s => {
                const editing = editId === s.id; const d = editing ? draft! : s; const p = prof(s.proficiency)
                return (
                  <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.1fr 2fr 64px', gap: 8, padding: '7px 14px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                    {editing ? (
                      <>
                        <input style={cell} value={d.topic} onChange={e => setDraft({ ...d, topic: e.target.value })} />
                        <select style={cell} value={d.proficiency} onChange={e => setDraft({ ...d, proficiency: e.target.value })}>
                          {PROFICIENCY.map(x => <option key={x.id} value={x.id}>{x.id}</option>)}
                        </select>
                        <input type="date" style={cell} value={d.last_reviewed} onChange={e => setDraft({ ...d, last_reviewed: e.target.value })} />
                        <input style={cell} value={d.next_action} placeholder="Next action" onChange={e => setDraft({ ...d, next_action: e.target.value })} />
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => save(d)} style={{ ...miniBtn, color: '#00d4aa' }}>✓</button>
                          <button onClick={() => { setEditId(null); setDraft(null) }} style={{ ...miniBtn, color: 'var(--text-muted)' }}>×</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 13 }}>{s.topic}</span>
                        <span><span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3, background: p.color + '20', color: p.color }}>{s.proficiency}</span></span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.last_reviewed || '—'}</span>
                        <span style={{ fontSize: 12, color: s.next_action ? 'var(--text-primary)' : 'var(--text-dim)' }}>{s.next_action || '—'}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => { setEditId(s.id); setDraft(s) }} style={{ ...miniBtn, color: 'var(--text-muted)' }}>✎</button>
                          <button onClick={() => del(s.id)} style={{ ...miniBtn, color: '#f43f5e' }}>×</button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
              {cs.length === 0 && <div style={{ padding: 16, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>No topics yet.</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const cell: React.CSSProperties = { ...inp, fontSize: 12, padding: '4px 7px' }
const miniBtn: React.CSSProperties = { width: 26, height: 26, borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 12 }
