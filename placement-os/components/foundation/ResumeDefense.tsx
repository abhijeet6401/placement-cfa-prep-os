'use client'

import { useEffect, useState } from 'react'
import { RESUME_SECTIONS, RESUME_STRENGTH, TRACKS } from '@/lib/foundation-config'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Bullet {
  id: number; section: string; bullet: string; follow_up_questions: string;
  methodology: string; quantified_impact: string; track: string; strength: number
}
function empty(): Bullet { return { id: 0, section: 'Experience', bullet: '', follow_up_questions: '', methodology: '', quantified_impact: '', track: 'all', strength: 1 } }

const strength = (v: number) => RESUME_STRENGTH.find(s => s.v === v) ?? RESUME_STRENGTH[0]
const track = (id: string) => TRACKS.find(t => t.id === id) ?? TRACKS[0]

export default function ResumeDefense() {
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [editing, setEditing] = useState<Bullet | null>(null)

  function load() { fetch('/api/resume').then(r => r.json()).then(setBullets) }
  useEffect(load, [])

  async function save(b: Bullet) {
    if (!b.bullet.trim()) { alert('Enter the resume bullet first.'); return }
    await fetch('/api/resume', { method: b.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })
    setEditing(null); load()
  }
  async function del(id: number) { if (!confirm('Delete bullet?')) return; await fetch(`/api/resume?id=${id}`, { method: 'DELETE' }); load() }

  // Readiness summary
  const bulletproof = bullets.filter(b => b.strength === 3).length
  const readiness = bullets.length ? Math.round((bullets.reduce((s, b) => s + b.strength, 0) / (bullets.length * 3)) * 100) : 0

  return (
    <div>
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: readiness >= 80 ? '#00d4aa' : readiness >= 50 ? '#f59e0b' : '#f43f5e', lineHeight: 1 }}>{readiness}%</div>
          <div style={label}>Defense Readiness</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{bulletproof}/{bullets.length} bullets bulletproof · every bullet should survive 3 layers of follow-up</div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${readiness}%`, height: '100%', background: readiness >= 80 ? '#00d4aa' : '#f59e0b' }} />
          </div>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Bullet</button>
      </div>

      {/* Matrix grouped by section */}
      {RESUME_SECTIONS.map(section => {
        const items = bullets.filter(b => b.section === section)
        if (items.length === 0) return null
        return (
          <div key={section} style={{ marginBottom: 18 }}>
            <div style={{ ...label, marginBottom: 8 }}>{section}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(b => {
                const st = strength(b.strength); const tr = track(b.track)
                return (
                  <div key={b.id} className="card" style={{ padding: 14, borderLeft: `3px solid ${st.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>&ldquo;{b.bullet}&rdquo;</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: tr.color + '20', color: tr.color }}>{tr.label}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: st.color + '20', color: st.color }}>{st.label}</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
                      <Cell title="Expected Follow-ups" body={b.follow_up_questions} color="#f59e0b" />
                      <Cell title="Methodology" body={b.methodology} color="#3b82f6" />
                      <Cell title="Quantified Impact" body={b.quantified_impact} color="#00d4aa" />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={() => setEditing(b)} style={btnGhost}>Edit</button>
                      <button onClick={() => del(b.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      {bullets.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No bullets yet. Add each resume line and prep its defense — e.g. &ldquo;Shortlisted 20 startups for investor deck.&rdquo;</div>}

      {editing && <BulletEditor bullet={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function Cell({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <div className="card" style={{ padding: 10, background: 'var(--bg-surface)' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: body ? 'var(--text-primary)' : 'var(--text-dim)', whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>{body || '— not prepped —'}</div>
    </div>
  )
}

function BulletEditor({ bullet, onSave, onCancel }: { bullet: Bullet; onSave: (b: Bullet) => void; onCancel: () => void }) {
  const [b, setB] = useState(bullet)
  const set = (k: keyof Bullet, v: unknown) => setB(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{b.id ? 'Edit' : 'Add'} Resume Bullet</div>
        <Field l="Resume Bullet (verbatim)"><textarea style={{ ...textarea, minHeight: 50 }} value={b.bullet} placeholder="e.g. Shortlisted 20 startups for investor deck" onChange={e => set('bullet', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Field l="Section">
            <select style={inp} value={b.section} onChange={e => set('section', e.target.value)}>
              {RESUME_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field l="Track">
            <select style={inp} value={b.track} onChange={e => set('track', e.target.value)}>
              {TRACKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </Field>
          <Field l="Strength">
            <select style={inp} value={b.strength} onChange={e => set('strength', parseInt(e.target.value))}>
              {RESUME_STRENGTH.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ height: 12 }} />
        <Field l="Expected Follow-up Questions"><textarea style={textarea} value={b.follow_up_questions} placeholder="What will they probe? 'How did you shortlist? What criteria? Why 20?'" onChange={e => set('follow_up_questions', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Methodology (how you actually did it)"><textarea style={textarea} value={b.methodology} placeholder="The real process — frameworks, tools, your specific role" onChange={e => set('methodology', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Quantified Impact"><input style={inp} value={b.quantified_impact} placeholder="The hard number / outcome" onChange={e => set('quantified_impact', e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(b)} style={btnPrimary}>Save Bullet</button>
        </div>
      </div>
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
