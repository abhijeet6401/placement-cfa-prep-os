'use client'

import { useEffect, useState } from 'react'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Guess {
  id: number
  prompt: string
  approach: string
  assumption_tree: string[]
  data_cuts: string[]
  estimate: number | null
  actual: number | null
  notes: string
}

interface Raw extends Omit<Guess, 'assumption_tree' | 'data_cuts'> { assumption_tree: string; data_cuts: string }

function parse(r: Raw): Guess {
  return { ...r, assumption_tree: safe(r.assumption_tree), data_cuts: safe(r.data_cuts) }
}
function safe(s: string): string[] { try { return JSON.parse(s) } catch { return [] } }
function empty(): Guess { return { id: 0, prompt: '', approach: 'bottom_up', assumption_tree: [''], data_cuts: [''], estimate: null, actual: null, notes: '' } }

function variance(est: number | null, act: number | null): number | null {
  if (est == null || act == null || act === 0) return null
  return ((est - act) / act) * 100
}

export default function GuesstimateEngine() {
  const [items, setItems] = useState<Guess[]>([])
  const [editing, setEditing] = useState<Guess | null>(null)

  function load() { fetch('/api/consulting/guesstimates').then(r => r.json()).then((rows: Raw[]) => setItems(rows.map(parse))) }
  useEffect(load, [])

  async function save(g: Guess) {
    const clean = { ...g, assumption_tree: g.assumption_tree.filter(Boolean), data_cuts: g.data_cuts.filter(Boolean) }
    await fetch('/api/consulting/guesstimates', { method: g.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clean) })
    setEditing(null); load()
  }
  async function del(id: number) { if (!confirm('Delete?')) return; await fetch(`/api/consulting/guesstimates?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label}>{items.length} guesstimates · assumption-building & sanity checks</div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ New Guesstimate</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {items.map(g => {
          const v = variance(g.estimate, g.actual)
          return (
            <div key={g.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{g.prompt || 'Untitled'}</div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: '#3b82f620', color: '#60a5fa', whiteSpace: 'nowrap', height: 'fit-content' }}>
                  {g.approach === 'bottom_up' ? 'BOTTOM-UP' : 'TOP-DOWN'}
                </span>
              </div>

              {g.data_cuts.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {g.data_cuts.map((d, i) => <span key={i} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{d}</span>)}
                </div>
              )}

              <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>ESTIMATE</div><div style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>{fmt(g.estimate)}</div></div>
                <div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>ACTUAL</div><div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(g.actual)}</div></div>
                {v != null && (
                  <div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>VARIANCE</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: Math.abs(v) <= 30 ? '#00d4aa' : Math.abs(v) <= 100 ? '#f59e0b' : '#f43f5e' }}>{v > 0 ? '+' : ''}{v.toFixed(0)}%</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setEditing(g)} style={btnGhost}>Open</button>
                <button onClick={() => del(g.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
              </div>
            </div>
          )
        })}
        {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No guesstimates yet. e.g. &ldquo;How many EV charging stations does Bengaluru need by 2030?&rdquo;</div>}
      </div>

      {editing && <GuessEditor g={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function fmt(n: number | null) { return n == null ? '—' : n.toLocaleString('en-IN') }

function GuessEditor({ g, onSave, onCancel }: { g: Guess; onSave: (g: Guess) => void; onCancel: () => void }) {
  const [s, setS] = useState(g)
  const set = (k: keyof Guess, v: unknown) => setS(p => ({ ...p, [k]: v }))
  const v = variance(s.estimate, s.actual)
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{s.id ? 'Edit' : 'New'} Guesstimate</div>
        <Field l="Prompt"><input style={inp} value={s.prompt} placeholder="Market size / count question" onChange={e => set('prompt', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Approach">
          <div style={{ display: 'flex', gap: 8 }}>
            {[['bottom_up', 'Bottom-Up'], ['top_down_proxy', 'Top-Down / Proxy']].map(([val, lab]) => (
              <button key={val} onClick={() => set('approach', val)} style={{
                flex: 1, padding: 8, borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: s.approach === val ? '#3b82f620' : 'var(--bg-surface)',
                border: `1px solid ${s.approach === val ? '#3b82f6' : 'var(--border)'}`,
                color: s.approach === val ? '#60a5fa' : 'var(--text-muted)',
              }}>{lab}</button>
            ))}
          </div>
        </Field>
        <div style={{ height: 12 }} />
        <Field l="Assumption Tree (each step)"><EditList items={s.assumption_tree} onChange={v => set('assumption_tree', v)} placeholder="e.g. Population of metro = 10M" prefix="→" /></Field>
        <div style={{ height: 12 }} />
        <Field l="Data Cuts / Segmentation"><EditList items={s.data_cuts} onChange={v => set('data_cuts', v)} placeholder="e.g. Urban vs Rural" prefix="•" /></Field>
        <div style={{ height: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Field l="Your Estimate"><input type="number" style={inp} value={s.estimate ?? ''} onChange={e => set('estimate', e.target.value ? +e.target.value : null)} /></Field>
          <Field l="Actual (if known)"><input type="number" style={inp} value={s.actual ?? ''} onChange={e => set('actual', e.target.value ? +e.target.value : null)} /></Field>
          <div>
            <div style={label}>Variance</div>
            <div style={{ ...inp, display: 'flex', alignItems: 'center', color: v == null ? 'var(--text-dim)' : Math.abs(v) <= 30 ? '#00d4aa' : '#f59e0b', fontWeight: 700 }}>
              {v == null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(0)}%`}
            </div>
          </div>
        </div>
        <div style={{ height: 10 }} />
        <Field l="Notes"><textarea style={textarea} value={s.notes} placeholder="Where did logic break? Which assumption was off?" onChange={e => set('notes', e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(s)} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  )
}

function EditList({ items, onChange, placeholder, prefix }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string; prefix: string }) {
  const list = items.length ? items : ['']
  return (
    <div>
      {list.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
          <span style={{ color: '#60a5fa', fontSize: 12, width: 14 }}>{prefix}</span>
          <input style={inp} value={item} placeholder={placeholder} onChange={e => { const n = [...list]; n[i] = e.target.value; onChange(n) }} />
          <button onClick={() => onChange(list.filter((_, j) => j !== i))} style={{ width: 24, background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      ))}
      <button onClick={() => onChange([...list, ''])} style={{ ...btnGhost, fontSize: 11, padding: '3px 10px', color: '#60a5fa', borderColor: '#3b82f650' }}>+ Add</button>
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
