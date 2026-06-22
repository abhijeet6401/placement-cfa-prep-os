'use client'

import { useEffect, useState } from 'react'

interface DCFModel {
  id: number
  name: string
  model_type: 'dcf' | 'macro_regression' | 'other'
  link: string
  wacc: number | null
  terminal_growth: number | null
  implied_value: number | null
  checklist: string // JSON
  notes: string
}

// Validity checks — including the coefficient-logic check from the spec
const DCF_CHECKS = [
  { id: 'wacc_sane', label: 'WACC is between 7–15% (sanity band)' },
  { id: 'tgr_below_gdp', label: 'Terminal growth ≤ long-run GDP / cost of capital' },
  { id: 'fcf_positive', label: 'Forecast FCF turns positive within horizon' },
  { id: 'sensitivity', label: 'Sensitivity table (WACC × g) built and inspected' },
  { id: 'reinvestment', label: 'Reinvestment rate consistent with growth assumption' },
  { id: 'margins', label: 'Margin assumptions reconcile to historical / peers' },
]
const MACRO_CHECKS = [
  { id: 'coef_sign', label: 'Coefficient signs are economically logical (e.g. negative correlation for capital outlays removed)' },
  { id: 'no_multicollinearity', label: 'Multicollinearity checked (VIF < 5)' },
  { id: 'stationarity', label: 'Variables stationary / cointegration tested' },
  { id: 'r2_honest', label: 'R² not inflated by spurious regressors' },
  { id: 'oos_test', label: 'Out-of-sample / holdout validation done' },
  { id: 'residuals', label: 'Residuals checked for autocorrelation & heteroskedasticity' },
]

export default function ModelDefenseLog() {
  const [models, setModels] = useState<DCFModel[]>([])
  const [editing, setEditing] = useState<DCFModel | null>(null)

  function load() { fetch('/api/dcf').then(r => r.json()).then(setModels) }
  useEffect(load, [])

  async function save(m: DCFModel) {
    const method = m.id ? 'PUT' : 'POST'
    await fetch('/api/dcf', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...m, checklist: parseChecklist(m.checklist) }) })
    setEditing(null); load()
  }
  async function del(id: number) {
    if (!confirm('Delete this model?')) return
    await fetch(`/api/dcf?id=${id}`, { method: 'DELETE' }); load()
  }

  function parseChecklist(c: string) { try { return JSON.parse(c) } catch { return {} } }

  function validityScore(m: DCFModel) {
    const checks = m.model_type === 'macro_regression' ? MACRO_CHECKS : DCF_CHECKS
    const state = parseChecklist(m.checklist)
    const passed = checks.filter(c => state[c.id]).length
    return { passed, total: checks.length }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="terminal-label">{models.length} models · DCF & macro-regression defense log</div>
        <button onClick={() => setEditing(emptyModel())} style={btnPrimary}>+ Log Model</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {models.map(m => {
          const { passed, total } = validityScore(m)
          const pct = Math.round((passed / total) * 100)
          const color = pct === 100 ? '#00d4aa' : pct >= 60 ? '#f59e0b' : '#f43f5e'
          return (
            <div key={m.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {m.model_type === 'macro_regression' ? 'MACRO REGRESSION' : m.model_type === 'dcf' ? 'DCF' : 'OTHER'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                    {m.wacc != null && <span>WACC <b style={{ color: 'var(--text-primary)' }}>{m.wacc}%</b></span>}
                    {m.terminal_growth != null && <span>g <b style={{ color: 'var(--text-primary)' }}>{m.terminal_growth}%</b></span>}
                    {m.implied_value != null && <span>Implied <b style={{ color: '#00d4aa' }}>{m.implied_value}</b></span>}
                    {m.link && <a href={m.link} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>↗ model</a>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color }}>{passed}/{total}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>checks passed</div>
                </div>
              </div>

              {/* Inline checklist */}
              <InlineChecklist model={m} checks={m.model_type === 'macro_regression' ? MACRO_CHECKS : DCF_CHECKS} onSave={save} />

              {m.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>{m.notes}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setEditing(m)} style={btnGhost}>Edit Details</button>
                <button onClick={() => del(m.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
              </div>
            </div>
          )
        })}
        {models.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            No models logged. Add a DCF or macro-regression model and verify its logical validity before you defend it in an interview.
          </div>
        )}
      </div>

      {editing && <ModelEditor model={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function InlineChecklist({ model, checks, onSave }: {
  model: DCFModel; checks: { id: string; label: string }[]; onSave: (m: DCFModel) => void
}) {
  const state = (() => { try { return JSON.parse(model.checklist) } catch { return {} } })()
  function toggle(id: string) {
    const next = { ...state, [id]: !state[id] }
    onSave({ ...model, checklist: JSON.stringify(next) })
  }
  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
      {checks.map(c => (
        <label key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer', fontSize: 11.5 }}>
          <div style={{
            width: 15, height: 15, flexShrink: 0, marginTop: 1, borderRadius: 3,
            border: `1.5px solid ${state[c.id] ? '#00d4aa' : 'var(--border-bright)'}`,
            background: state[c.id] ? '#00d4aa' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} onClick={() => toggle(c.id)}>
            {state[c.id] && <span style={{ color: '#000', fontSize: 10, fontWeight: 800 }}>✓</span>}
          </div>
          <span style={{ color: state[c.id] ? 'var(--text-muted)' : 'var(--text-primary)' }} onClick={() => toggle(c.id)}>{c.label}</span>
        </label>
      ))}
    </div>
  )
}

function ModelEditor({ model, onSave, onCancel }: { model: DCFModel; onSave: (m: DCFModel) => void; onCancel: () => void }) {
  const [m, setM] = useState(model)
  const set = (k: keyof DCFModel, v: unknown) => setM(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div className="card-elevated" style={{ ...modal, background: 'var(--bg-elevated)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{m.id ? 'Edit' : 'Log'} Model</div>
        <Field label="Model Name"><input style={inp} value={m.name} onChange={e => set('name', e.target.value)} placeholder="L&T DCF — base case" /></Field>
        <div style={{ height: 10 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Model Type">
            <select style={inp} value={m.model_type} onChange={e => set('model_type', e.target.value)}>
              <option value="dcf">DCF</option>
              <option value="macro_regression">Macro Regression</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Link (Sheet/Colab)"><input style={inp} value={m.link} onChange={e => set('link', e.target.value)} placeholder="https://..." /></Field>
          <Field label="WACC %"><input type="number" style={inp} value={m.wacc ?? ''} onChange={e => set('wacc', e.target.value ? parseFloat(e.target.value) : null)} /></Field>
          <Field label="Terminal Growth %"><input type="number" style={inp} value={m.terminal_growth ?? ''} onChange={e => set('terminal_growth', e.target.value ? parseFloat(e.target.value) : null)} /></Field>
          <Field label="Implied Value"><input type="number" style={inp} value={m.implied_value ?? ''} onChange={e => set('implied_value', e.target.value ? parseFloat(e.target.value) : null)} /></Field>
        </div>
        <div style={{ height: 10 }} />
        <Field label="Notes / Defense Points"><textarea style={{ ...inp, minHeight: 80, resize: 'vertical', fontFamily: 'inherit' }} value={m.notes} onChange={e => set('notes', e.target.value)} placeholder="Key assumptions you'd defend, where the model is fragile..." /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(m)} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  )
}

function emptyModel(): DCFModel {
  return { id: 0, name: '', model_type: 'dcf', link: '', wacc: null, terminal_growth: null, implied_value: null, checklist: '{}', notes: '' }
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div className="terminal-label" style={{ marginBottom: 4 }}>{label}</div>{children}</label>
}

const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-bright)', borderRadius: 4, padding: '7px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }
const btnPrimary: React.CSSProperties = { padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: '#00d4aa20', border: '1px solid #00d4aa50', color: '#00d4aa', cursor: 'pointer' }
const btnGhost: React.CSSProperties = { padding: '5px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--text-muted)', cursor: 'pointer' }
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }
const modal: React.CSSProperties = { width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 24, borderRadius: 10 }
