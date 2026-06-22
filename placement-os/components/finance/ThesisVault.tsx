'use client'

import { useEffect, useState } from 'react'

interface Thesis {
  id: number
  ticker: string
  company: string
  sector: string
  direction: 'long' | 'short'
  conviction: number
  target_price: number | null
  current_price: number | null
  time_horizon: string
  catalyst: string
  thesis: string
  risks: string
  status: 'draft' | 'refined' | 'pitch_ready'
}

const EMPTY: Thesis = {
  id: 0, ticker: '', company: '', sector: 'Capital Goods', direction: 'long',
  conviction: 3, target_price: null, current_price: null, time_horizon: '12 months',
  catalyst: '', thesis: '', risks: '', status: 'draft',
}

const STATUS_META = {
  draft:       { label: 'Draft',       color: '#475569' },
  refined:     { label: 'Refined',     color: '#f59e0b' },
  pitch_ready: { label: 'Pitch Ready', color: '#00d4aa' },
}

const SECTORS = ['Capital Goods', 'Infrastructure', 'Financials', 'Energy', 'IT', 'Consumer', 'Healthcare', 'Materials', 'Other']

export default function ThesisVault() {
  const [theses, setTheses] = useState<Thesis[]>([])
  const [editing, setEditing] = useState<Thesis | null>(null)

  function load() {
    fetch('/api/theses').then(r => r.json()).then(setTheses)
  }
  useEffect(load, [])

  async function save(t: Thesis) {
    const method = t.id ? 'PUT' : 'POST'
    await fetch('/api/theses', {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    })
    setEditing(null)
    load()
  }

  async function del(id: number) {
    if (!confirm('Delete this thesis?')) return
    await fetch(`/api/theses?id=${id}`, { method: 'DELETE' })
    load()
  }

  const upside = (t: Thesis) =>
    t.target_price && t.current_price ? ((t.target_price - t.current_price) / t.current_price) * 100 : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="terminal-label">{theses.length} theses · long/short equity ideas</div>
        <button onClick={() => setEditing({ ...EMPTY })} style={btnPrimary}>+ New Thesis</button>
      </div>

      {/* Grid of thesis cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {theses.map(t => {
          const up = upside(t)
          const sm = STATUS_META[t.status]
          return (
            <div key={t.id} className="card" style={{ padding: 14, borderColor: t.direction === 'long' ? '#00d4aa30' : '#f43f5e30' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                      background: t.direction === 'long' ? '#00d4aa20' : '#f43f5e20',
                      color: t.direction === 'long' ? '#00d4aa' : '#f43f5e',
                    }}>{t.direction.toUpperCase()}</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{t.ticker || t.company}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.company} · {t.sector}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: sm.color + '20', color: sm.color }}>
                  {sm.label}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 14, margin: '8px 0', fontSize: 11 }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Conviction </span><span style={{ color: '#f59e0b' }}>{'★'.repeat(t.conviction)}</span></div>
                {up !== null && (
                  <div><span style={{ color: 'var(--text-muted)' }}>Upside </span>
                    <span style={{ color: up >= 0 ? '#00d4aa' : '#f43f5e', fontWeight: 600 }}>{up >= 0 ? '+' : ''}{up.toFixed(1)}%</span>
                  </div>
                )}
                {t.time_horizon && <div style={{ color: 'var(--text-muted)' }}>{t.time_horizon}</div>}
              </div>

              {t.thesis && <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.thesis}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setEditing(t)} style={btnGhost}>Edit</button>
                <button onClick={() => del(t.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
              </div>
            </div>
          )
        })}
        {theses.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            No theses yet. Draft your first long/short idea — capital goods & infrastructure are good starting sectors.
          </div>
        )}
      </div>

      {/* Editor modal */}
      {editing && (
        <ThesisEditor thesis={editing} sectors={SECTORS} onSave={save} onCancel={() => setEditing(null)} />
      )}
    </div>
  )
}

function ThesisEditor({ thesis, sectors, onSave, onCancel }: {
  thesis: Thesis; sectors: string[]; onSave: (t: Thesis) => void; onCancel: () => void
}) {
  const [t, setT] = useState(thesis)
  const set = (k: keyof Thesis, v: unknown) => setT(prev => ({ ...prev, [k]: v }))

  return (
    <div style={overlay} onClick={onCancel}>
      <div className="card-elevated" style={{ ...modal, background: 'var(--bg-elevated)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{t.id ? 'Edit' : 'New'} Equity Thesis</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field label="Ticker"><input style={inp} value={t.ticker} onChange={e => set('ticker', e.target.value)} placeholder="e.g. LT" /></Field>
          <Field label="Company"><input style={inp} value={t.company} onChange={e => set('company', e.target.value)} placeholder="Larsen & Toubro" /></Field>
          <Field label="Sector">
            <select style={inp} value={t.sector} onChange={e => set('sector', e.target.value)}>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Direction">
            <select style={inp} value={t.direction} onChange={e => set('direction', e.target.value)}>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </Field>
          <Field label="Current Price"><input type="number" style={inp} value={t.current_price ?? ''} onChange={e => set('current_price', e.target.value ? parseFloat(e.target.value) : null)} /></Field>
          <Field label="Target Price"><input type="number" style={inp} value={t.target_price ?? ''} onChange={e => set('target_price', e.target.value ? parseFloat(e.target.value) : null)} /></Field>
          <Field label="Time Horizon"><input style={inp} value={t.time_horizon} onChange={e => set('time_horizon', e.target.value)} placeholder="12 months" /></Field>
          <Field label={`Conviction (${t.conviction}/5)`}>
            <input type="range" min={1} max={5} value={t.conviction} onChange={e => set('conviction', parseInt(e.target.value))} style={{ width: '100%' }} />
          </Field>
        </div>

        <Field label="Catalyst"><input style={inp} value={t.catalyst} onChange={e => set('catalyst', e.target.value)} placeholder="What unlocks the value? Order book, capex cycle, margin expansion..." /></Field>
        <div style={{ height: 10 }} />
        <Field label="Thesis"><textarea style={{ ...inp, minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }} value={t.thesis} onChange={e => set('thesis', e.target.value)} placeholder="Core argument — why is the market mispricing this? Drivers, unit economics, competitive moat..." /></Field>
        <div style={{ height: 10 }} />
        <Field label="Key Risks"><textarea style={{ ...inp, minHeight: 70, resize: 'vertical', fontFamily: 'inherit' }} value={t.risks} onChange={e => set('risks', e.target.value)} placeholder="What breaks the thesis? Cyclicality, leverage, execution risk..." /></Field>
        <div style={{ height: 10 }} />
        <Field label="Status">
          <select style={inp} value={t.status} onChange={e => set('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="refined">Refined</option>
            <option value="pitch_ready">Pitch Ready</option>
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(t)} style={btnPrimary}>Save Thesis</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <div className="terminal-label" style={{ marginBottom: 4 }}>{label}</div>
      {children}
    </label>
  )
}

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-bright)',
  borderRadius: 4, padding: '7px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
}
const btnPrimary: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600,
  background: '#00d4aa20', border: '1px solid #00d4aa50', color: '#00d4aa', cursor: 'pointer',
}
const btnGhost: React.CSSProperties = {
  padding: '5px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500,
  background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--text-muted)', cursor: 'pointer',
}
const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
}
const modal: React.CSSProperties = {
  width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 24, borderRadius: 10,
}
