'use client'

import { useEffect, useState } from 'react'
import { CASE_TYPES, CASE_TYPE_COLORS, PILLARS } from '@/lib/consulting-config'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label, gradeColor } from './ui'

export interface CaseRow {
  id: number
  case_date: string
  title: string
  case_type: string
  partner: string
  g_clarify: number
  g_structure: number
  g_math: number
  g_synth: number
  partner_feedback: string
  self_reflection: string
}

function empty(): CaseRow {
  return { id: 0, case_date: new Date().toISOString().split('T')[0], title: '', case_type: 'Profitability', partner: '', g_clarify: 0, g_structure: 0, g_math: 0, g_synth: 0, partner_feedback: '', self_reflection: '' }
}

export default function CaseLog({ onChanged }: { onChanged?: () => void }) {
  const [cases, setCases] = useState<CaseRow[]>([])
  const [editing, setEditing] = useState<CaseRow | null>(null)
  const [open, setOpen] = useState<Record<number, boolean>>({})

  function load() { fetch('/api/consulting/cases').then(r => r.json()).then(setCases) }
  useEffect(load, [])

  async function save(c: CaseRow) {
    await fetch('/api/consulting/cases', { method: c.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
    setEditing(null); load(); onChanged?.()
  }
  async function del(id: number) {
    if (!confirm('Delete this case?')) return
    await fetch(`/api/consulting/cases?id=${id}`, { method: 'DELETE' }); load(); onChanged?.()
  }

  const avg = (c: CaseRow) => (c.g_clarify + c.g_structure + c.g_math + c.g_synth) / 4

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label as React.CSSProperties}>{cases.length} cases logged · 4-pillar grading</div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Log Case</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cases.map(c => {
          const a = avg(c)
          const isOpen = open[c.id]
          const tc = CASE_TYPE_COLORS[c.case_type] ?? '#888'
          return (
            <div key={c.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Accordion header */}
              <button onClick={() => setOpen(o => ({ ...o, [c.id]: !o[c.id] }))} style={{
                width: '100%', padding: '12px 14px', background: 'transparent', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 11, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▶</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: tc + '20', color: tc, minWidth: 90, textAlign: 'center' }}>{c.case_type}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title || 'Untitled case'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.case_date}{c.partner ? ` · with ${c.partner}` : ''}</div>
                </div>
                {/* mini pillar dots */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {PILLARS.map(p => {
                    const v = c[p.key] as number
                    return <span key={p.key} title={`${p.short}: ${v}/5`} style={{ width: 18, height: 18, borderRadius: 3, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: gradeColor(v) + '22', color: gradeColor(v) }}>{v || '–'}</span>
                  })}
                </div>
                <div style={{ width: 50, textAlign: 'right' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: gradeColor(a) }}>{a ? a.toFixed(1) : '—'}</span>
                </div>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '12px 0' }}>
                    {PILLARS.map(p => {
                      const v = c[p.key] as number
                      return (
                        <div key={p.key} className="card" style={{ padding: 10, background: 'var(--bg-surface)' }}>
                          <div style={{ fontSize: 24, fontWeight: 800, color: gradeColor(v), lineHeight: 1 }}>{v || '–'}<span style={{ fontSize: 12, color: 'var(--text-dim)' }}>/5</span></div>
                          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{p.label}</div>
                        </div>
                      )
                    })}
                  </div>
                  {c.partner_feedback && <FeedbackBlock title="Partner's Feedback" body={c.partner_feedback} color="#f59e0b" />}
                  {c.self_reflection && <FeedbackBlock title="Self-Reflection / Key Takeaway" body={c.self_reflection} color="#00d4aa" />}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setEditing(c)} style={btnGhost}>Edit</button>
                    <button onClick={() => del(c.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {cases.length === 0 && <Empty />}
      </div>

      {editing && <CaseEditor row={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function FeedbackBlock({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <div style={{ marginTop: 8, borderLeft: `2px solid ${color}`, paddingLeft: 10 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 3, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{body}</div>
    </div>
  )
}

function CaseEditor({ row, onSave, onCancel }: { row: CaseRow; onSave: (c: CaseRow) => void; onCancel: () => void }) {
  const [c, setC] = useState(row)
  const set = (k: keyof CaseRow, v: unknown) => setC(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{c.id ? 'Edit' : 'Log'} Case</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field l="Case Title"><input style={inp} value={c.title} placeholder="e.g. Declining margins for a cement co." onChange={e => set('title', e.target.value)} /></Field>
          <Field l="Date"><input type="date" style={inp} value={c.case_date} onChange={e => set('case_date', e.target.value)} /></Field>
          <Field l="Case Type">
            <select style={inp} value={c.case_type} onChange={e => set('case_type', e.target.value)}>
              {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field l="Partner / Peer"><input style={inp} value={c.partner} placeholder="Name" onChange={e => set('partner', e.target.value)} /></Field>
        </div>

        <div style={label as React.CSSProperties}>Performance Grading Matrix (1–5)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '6px 0 14px' }}>
          {PILLARS.map(p => (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, fontSize: 12 }}>{p.label}</div>
              <GradePicker value={c[p.key] as number} onChange={v => set(p.key, v)} />
            </div>
          ))}
        </div>

        <Field l="Partner's Feedback"><textarea style={textarea} value={c.partner_feedback} placeholder="What did the interviewer flag? Structure gaps, math errors, weak synthesis..." onChange={e => set('partner_feedback', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Self-Reflection / Key Takeaway"><textarea style={textarea} value={c.self_reflection} placeholder="The ONE thing to fix next time so the mistake isn't repeated." onChange={e => set('self_reflection', e.target.value)} /></Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(c)} style={btnPrimary}>Save Case</button>
        </div>
      </div>
    </div>
  )
}

function GradePicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange(n === value ? 0 : n)} style={{
          width: 30, height: 30, borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          background: value >= n ? gradeColor(value) + '22' : 'var(--bg-surface)',
          border: `1px solid ${value >= n ? gradeColor(value) : 'var(--border)'}`,
          color: value >= n ? gradeColor(value) : 'var(--text-dim)',
        }}>{n}</button>
      ))}
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label as React.CSSProperties}>{l}</div>{children}</label>
}
function Empty() {
  return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No cases logged yet. Click <b style={{ color: '#60a5fa' }}>+ Log Case</b> after your next practice.</div>
}
