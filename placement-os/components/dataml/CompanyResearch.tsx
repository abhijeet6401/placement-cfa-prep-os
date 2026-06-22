'use client'

import { useEffect, useState } from 'react'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Research {
  id: number; company: string; ai_initiatives: string; tech_stack: string;
  prev_questions: string; notes: string
}
function empty(): Research { return { id: 0, company: '', ai_initiatives: '', tech_stack: '', prev_questions: '', notes: '' } }

export default function CompanyResearch() {
  const [items, setItems] = useState<Research[]>([])
  const [editing, setEditing] = useState<Research | null>(null)
  const [open, setOpen] = useState<Record<number, boolean>>({})

  function load() { fetch('/api/dataml/research').then(r => r.json()).then(setItems) }
  useEffect(load, [])

  async function save(r: Research) {
    await fetch('/api/dataml/research', { method: r.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
    setEditing(null); load()
  }
  async function del(id: number) { if (!confirm('Delete?')) return; await fetch(`/api/dataml/research?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label}>{items.length} firms · AI initiatives, stack & past interview questions</div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Firm</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(r => {
          const isOpen = open[r.id]
          return (
            <div key={r.id} className="card" style={{ overflow: 'hidden' }}>
              <button onClick={() => setOpen(o => ({ ...o, [r.id]: !o[r.id] }))} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 11, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▶</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.company}</span>
                {r.tech_stack && <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 8 }}>{r.tech_stack.slice(0, 50)}{r.tech_stack.length > 50 ? '…' : ''}</span>}
              </button>
              {isOpen && (
                <div style={{ padding: '0 14px 14px 36px', borderTop: '1px solid var(--border)' }}>
                  <Block title="Recent AI Initiatives" body={r.ai_initiatives} color="#8b5cf6" />
                  <Block title="Technical Stack" body={r.tech_stack} color="#3b82f6" />
                  <Block title="Previous Year Interview Questions" body={r.prev_questions} color="#f59e0b" />
                  <Block title="Notes" body={r.notes} color="#00d4aa" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setEditing(r)} style={btnGhost}>Edit</button>
                    <button onClick={() => del(r.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {items.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No firms logged. Research target companies&apos; AI work and past interview questions.</div>}
      </div>

      {editing && <ResearchEditor research={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function Block({ title, body, color }: { title: string; body: string; color: string }) {
  if (!body) return null
  return (
    <div style={{ marginTop: 10, borderLeft: `2px solid ${color}`, paddingLeft: 10 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 3, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{body}</div>
    </div>
  )
}

function ResearchEditor({ research, onSave, onCancel }: { research: Research; onSave: (r: Research) => void; onCancel: () => void }) {
  const [r, setR] = useState(research)
  const set = (k: keyof Research, v: unknown) => setR(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{r.id ? 'Edit' : 'Add'} Firm Research</div>
        <Field l="Company Name"><input style={inp} value={r.company} placeholder="e.g. Microsoft" onChange={e => set('company', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Recent AI Initiatives"><textarea style={textarea} value={r.ai_initiatives} placeholder="Their latest AI/ML products, research, GenAI bets..." onChange={e => set('ai_initiatives', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Technical Stack"><textarea style={textarea} value={r.tech_stack} placeholder="Languages, frameworks, cloud, data infra they use..." onChange={e => set('tech_stack', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Previous Year Interview Questions"><textarea style={textarea} value={r.prev_questions} placeholder="Questions asked in past rounds (from seniors, Glassdoor)..." onChange={e => set('prev_questions', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Notes"><textarea style={textarea} value={r.notes} placeholder="Anything else — culture, contacts, JD specifics..." onChange={e => set('notes', e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(r)} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
