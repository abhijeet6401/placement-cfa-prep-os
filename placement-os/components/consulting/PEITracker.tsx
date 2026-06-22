'use client'

import { useEffect, useState } from 'react'
import { PEI_DIMENSIONS } from '@/lib/consulting-config'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Story {
  id: number
  dimension: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  impact: string
}
function empty(dim: string): Story { return { id: 0, dimension: dim, title: '', situation: '', task: '', action: '', result: '', impact: '' } }

export default function PEITracker() {
  const [stories, setStories] = useState<Story[]>([])
  const [editing, setEditing] = useState<Story | null>(null)

  function load() { fetch('/api/consulting/pei').then(r => r.json()).then(setStories) }
  useEffect(load, [])

  async function save(s: Story) {
    if (!s.impact.trim()) { alert('Impact Quantifier is mandatory — attach a hard number or specific outcome to this story.'); return }
    await fetch('/api/consulting/pei', { method: s.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
    setEditing(null); load()
  }
  async function del(id: number) { if (!confirm('Delete?')) return; await fetch(`/api/consulting/pei?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <div style={{ ...label, marginBottom: 14 }}>STAR stories mapped to 3 core consulting dimensions · every story needs a quantified impact</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PEI_DIMENSIONS.map(dim => {
          const ds = stories.filter(s => s.dimension === dim.id)
          return (
            <div key={dim.id} className="card" style={{ padding: 16, borderLeft: `3px solid ${dim.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: dim.color }}>{dim.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dim.hint}</div>
                </div>
                <button onClick={() => setEditing(empty(dim.id))} style={{ ...btnGhost, color: dim.color, borderColor: dim.color + '50' }}>+ Story</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, marginTop: 10 }}>
                {ds.map(s => (
                  <div key={s.id} className="card" style={{ padding: 12, background: 'var(--bg-surface)' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{s.title || 'Untitled story'}</div>
                    <StarRow letter="S" label="Situation" body={s.situation} />
                    <StarRow letter="T" label="Task" body={s.task} />
                    <StarRow letter="A" label="Action" body={s.action} />
                    <StarRow letter="R" label="Result" body={s.result} />
                    {s.impact && (
                      <div style={{ marginTop: 8, padding: '6px 8px', borderRadius: 4, background: dim.color + '15', border: `1px solid ${dim.color}40` }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: dim.color }}>⚡ IMPACT </span>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{s.impact}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button onClick={() => setEditing(s)} style={{ ...btnGhost, fontSize: 11, padding: '3px 9px' }}>Edit</button>
                      <button onClick={() => del(s.id)} style={{ ...btnGhost, fontSize: 11, padding: '3px 9px', color: '#f43f5e' }}>Delete</button>
                    </div>
                  </div>
                ))}
                {ds.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '8px 0' }}>No story yet for this dimension.</div>}
              </div>
            </div>
          )
        })}
      </div>

      {editing && <StoryEditor story={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function StarRow({ letter, label: l, body }: { letter: string; label: string; body: string }) {
  if (!body) return null
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
      <span style={{ fontSize: 9, fontWeight: 800, color: '#60a5fa', width: 12, flexShrink: 0 }}>{letter}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}><b style={{ color: 'var(--text-dim)' }}>{l}:</b> {body}</span>
    </div>
  )
}

function StoryEditor({ story, onSave, onCancel }: { story: Story; onSave: (s: Story) => void; onCancel: () => void }) {
  const [s, setS] = useState(story)
  const set = (k: keyof Story, v: unknown) => setS(p => ({ ...p, [k]: v }))
  const dim = PEI_DIMENSIONS.find(d => d.id === s.dimension) ?? PEI_DIMENSIONS[0]
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.id ? 'Edit' : 'New'} PEI Story</div>
        <div style={{ fontSize: 11, color: dim.color, marginBottom: 16 }}>{s.dimension}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field l="Story Title"><input style={inp} value={s.title} placeholder="Short handle, e.g. 'Founded campus VC cell'" onChange={e => set('title', e.target.value)} /></Field>
          <Field l="Dimension">
            <select style={inp} value={s.dimension} onChange={e => set('dimension', e.target.value)}>
              {PEI_DIMENSIONS.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
            </select>
          </Field>
        </div>

        <Field l="S · Situation"><textarea style={textarea} value={s.situation} onChange={e => set('situation', e.target.value)} placeholder="Context & backdrop" /></Field>
        <div style={{ height: 8 }} />
        <Field l="T · Task"><textarea style={textarea} value={s.task} onChange={e => set('task', e.target.value)} placeholder="Your specific responsibility / goal" /></Field>
        <div style={{ height: 8 }} />
        <Field l="A · Action"><textarea style={textarea} value={s.action} onChange={e => set('action', e.target.value)} placeholder="What YOU did — be specific about your role" /></Field>
        <div style={{ height: 8 }} />
        <Field l="R · Result"><textarea style={textarea} value={s.result} onChange={e => set('result', e.target.value)} placeholder="Outcome" /></Field>
        <div style={{ height: 8 }} />
        <div style={{ border: `1px solid ${dim.color}50`, borderRadius: 6, padding: 10, background: dim.color + '10' }}>
          <Field l="⚡ Impact Quantifier (mandatory)"><input style={inp} value={s.impact} placeholder="e.g. 'Led contingent of 40 students', 'Shortlisted 20 startups for investor deck'" onChange={e => set('impact', e.target.value)} /></Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(s)} style={btnPrimary}>Save Story</button>
        </div>
      </div>
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
