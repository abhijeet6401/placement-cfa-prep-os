'use client'

import { Field } from '@/lib/pm-config'
import { inp, textarea } from './ui'

type Val = unknown
type Data = Record<string, Val>

export function FieldRenderer({ field, value, onChange, accent }: {
  field: Field; value: Val; onChange: (v: Val) => void; accent: string
}) {
  switch (field.type) {
    case 'text':
      return <input style={inp} value={(value as string) ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} />
    case 'number':
      return <input type="number" style={inp} value={(value as number) ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value ? parseFloat(e.target.value) : null)} />
    case 'textarea':
      return <textarea style={textarea} value={(value as string) ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} />
    case 'select':
      return (
        <select style={inp} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)}>
          <option value="">— select —</option>
          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    case 'list':    return <ListField value={value as string[]} onChange={onChange} placeholder={field.placeholder} accent={accent} />
    case 'tags':    return <ListField value={value as string[]} onChange={onChange} placeholder={field.placeholder} accent={accent} />
    case 'kv_list': return <KvListField value={value as KV[]} onChange={onChange} accent={accent} hint={field.hint} />
    case 'rice':    return <RiceField value={value as RiceRow[]} onChange={onChange} accent={accent} />
    case 'unit_econ': return <UnitEconField value={value as UnitEcon} onChange={onChange} accent={accent} />
    case 'rca_tree':  return <RcaTreeField value={value as RcaTree} onChange={onChange} accent={accent} />
    case 'metric_pair': return <MetricPairField value={value as MetricPair} onChange={onChange} accent={accent} />
    case 'timer':   return <TimerField value={value as TimerVal} onChange={onChange} accent={accent} />
    default: return null
  }
}

// ── List ──────────────────────────────────────────────────────────────
function ListField({ value, onChange, placeholder, accent }: { value?: string[]; onChange: (v: string[]) => void; placeholder?: string; accent: string }) {
  const items = value ?? []
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          <span style={{ color: accent, fontSize: 13, paddingTop: 8 }}>•</span>
          <input style={inp} value={item} placeholder={placeholder} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={rmBtn}>×</button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} style={{ ...addBtn, color: accent, borderColor: accent + '50' }}>+ Add item</button>
    </div>
  )
}

// ── Key-Value list (trade-off log) ────────────────────────────────────
type KV = { k: string; v: string }
function KvListField({ value, onChange, accent, hint }: { value?: KV[]; onChange: (v: KV[]) => void; accent: string; hint?: string }) {
  const rows = value ?? []
  return (
    <div>
      {hint && <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6 }}>{hint}</div>}
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          <input style={{ ...inp, flex: 1 }} placeholder="Decision" value={row.k} onChange={e => { const n = [...rows]; n[i] = { ...n[i], k: e.target.value }; onChange(n) }} />
          <span style={{ color: 'var(--text-muted)', paddingTop: 8 }}>→</span>
          <input style={{ ...inp, flex: 1.4 }} placeholder="Product impact / trade-off" value={row.v} onChange={e => { const n = [...rows]; n[i] = { ...n[i], v: e.target.value }; onChange(n) }} />
          <button onClick={() => onChange(rows.filter((_, j) => j !== i))} style={rmBtn}>×</button>
        </div>
      ))}
      <button onClick={() => onChange([...rows, { k: '', v: '' }])} style={{ ...addBtn, color: accent, borderColor: accent + '50' }}>+ Add trade-off</button>
    </div>
  )
}

// ── RICE prioritization ───────────────────────────────────────────────
type RiceRow = { feature: string; reach: number; impact: number; confidence: number; effort: number }
function RiceField({ value, onChange, accent }: { value?: RiceRow[]; onChange: (v: RiceRow[]) => void; accent: string }) {
  const rows = value ?? []
  const score = (r: RiceRow) => r.effort > 0 ? (r.reach * r.impact * (r.confidence / 100)) / r.effort : 0
  const sorted = [...rows].map((r, i) => ({ r, i, s: score(r) })).sort((a, b) => b.s - a.s)
  return (
    <div className="card" style={{ padding: 10, background: 'var(--bg-surface)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.9fr 24px', gap: 6, fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
        <span>Feature</span><span>Reach</span><span>Impact</span><span>Conf %</span><span>Effort</span><span>Score</span><span></span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.9fr 24px', gap: 6, marginBottom: 4, alignItems: 'center' }}>
          <input style={miniInp} value={r.feature} placeholder="Feature" onChange={e => upd(i, 'feature', e.target.value)} />
          <input style={miniInp} type="number" value={r.reach || ''} onChange={e => upd(i, 'reach', +e.target.value)} />
          <input style={miniInp} type="number" value={r.impact || ''} placeholder="0-3" onChange={e => upd(i, 'impact', +e.target.value)} />
          <input style={miniInp} type="number" value={r.confidence || ''} placeholder="80" onChange={e => upd(i, 'confidence', +e.target.value)} />
          <input style={miniInp} type="number" value={r.effort || ''} onChange={e => upd(i, 'effort', +e.target.value)} />
          <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{score(r).toFixed(1)}</span>
          <button onClick={() => onChange(rows.filter((_, j) => j !== i))} style={rmBtn}>×</button>
        </div>
      ))}
      <button onClick={() => onChange([...rows, { feature: '', reach: 0, impact: 0, confidence: 80, effort: 1 }])} style={{ ...addBtn, color: accent, borderColor: accent + '50', marginTop: 4 }}>+ Add feature</button>
      {sorted.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
          Priority: {sorted.filter(x => x.r.feature).map((x, n) => <span key={x.i}><b style={{ color: accent }}>{n + 1}. {x.r.feature}</b>{n < sorted.filter(y => y.r.feature).length - 1 ? '  ›  ' : ''}</span>)}
        </div>
      )}
    </div>
  )

  function upd(i: number, k: keyof RiceRow, v: string | number) { const n = [...rows]; n[i] = { ...n[i], [k]: v }; onChange(n) }
}

// ── Unit economics simulator ──────────────────────────────────────────
type UnitEcon = { cac: number; arpu: number; margin: number; churn: number; incentive: number }
function UnitEconField({ value, onChange, accent }: { value?: UnitEcon; onChange: (v: UnitEcon) => void; accent: string }) {
  const u = value ?? { cac: 0, arpu: 0, margin: 0, churn: 0, incentive: 0 }
  const lifetimeMonths = u.churn > 0 ? 1 / (u.churn / 100) : 0
  const ltv = u.arpu * (u.margin / 100) * lifetimeMonths - u.incentive
  const ratio = u.cac > 0 ? ltv / u.cac : 0
  const monthlyContribution = u.arpu * (u.margin / 100)
  const payback = monthlyContribution > 0 ? (u.cac + u.incentive) / monthlyContribution : 0
  const set = (k: keyof UnitEcon, v: number) => onChange({ ...u, [k]: v })
  return (
    <div className="card" style={{ padding: 12, background: 'var(--bg-surface)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        <Mini label="CAC (₹)" val={u.cac} onChange={v => set('cac', v)} />
        <Mini label="ARPU/mo (₹)" val={u.arpu} onChange={v => set('arpu', v)} />
        <Mini label="Gross Margin %" val={u.margin} onChange={v => set('margin', v)} />
        <Mini label="Monthly Churn %" val={u.churn} onChange={v => set('churn', v)} />
        <Mini label="Merchant Incentive (₹)" val={u.incentive} onChange={v => set('incentive', v)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <Out label="LTV" val={`₹${ltv.toFixed(0)}`} color={accent} />
        <Out label="LTV : CAC" val={ratio ? `${ratio.toFixed(1)}x` : '—'} color={ratio >= 3 ? '#00d4aa' : ratio >= 1 ? '#f59e0b' : '#f43f5e'} />
        <Out label="Payback (mo)" val={payback ? payback.toFixed(1) : '—'} color={payback && payback <= 12 ? '#00d4aa' : '#f59e0b'} />
        <Out label="Avg Lifetime (mo)" val={lifetimeMonths ? lifetimeMonths.toFixed(1) : '—'} color="#3b82f6" />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>
        LTV = ARPU × margin × (1/churn) − incentive · healthy LTV:CAC ≥ 3x, payback ≤ 12mo
      </div>
    </div>
  )
}
function Mini({ label, val, onChange }: { label: string; val: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600 }}>{label}</div>
      <input type="number" style={miniInp} value={val || ''} onChange={e => onChange(+e.target.value)} />
    </label>
  )
}
function Out({ label, val, color }: { label: string; val: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

// ── RCA diagnostic tree ───────────────────────────────────────────────
type RcaTree = { clarifying: string[]; external: string[]; internal: string[] }
function RcaTreeField({ value, onChange, accent }: { value?: RcaTree; onChange: (v: RcaTree) => void; accent: string }) {
  const t = value ?? { clarifying: [], external: [], internal: [] }
  const branches: { key: keyof RcaTree; label: string; hint: string; color: string }[] = [
    { key: 'clarifying', label: '1 · Clarifying Questions', hint: 'Seasonal? Global vs local? iOS vs Android? New vs returning?', color: '#3b82f6' },
    { key: 'external', label: '2 · External Factors', hint: 'Competitor moves, regulation, internet/ISP outage, holidays', color: '#f59e0b' },
    { key: 'internal', label: '3 · Internal Factors', hint: 'Buggy release, tracking/analytics down, marketing spend shift, pricing change', color: '#f43f5e' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {branches.map(b => (
        <div key={b.key} className="card" style={{ padding: 10, background: 'var(--bg-surface)', borderLeft: `3px solid ${b.color}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: b.color, marginBottom: 2 }}>{b.label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6 }}>{b.hint}</div>
          <ListField value={t[b.key]} onChange={v => onChange({ ...t, [b.key]: v })} placeholder="Add a hypothesis / question..." accent={accent} />
        </div>
      ))}
    </div>
  )
}

// ── North Star + Guardrails ───────────────────────────────────────────
type MetricPair = { northStar: string; guardrails: string[] }
function MetricPairField({ value, onChange, accent }: { value?: MetricPair; onChange: (v: MetricPair) => void; accent: string }) {
  const m = value ?? { northStar: '', guardrails: [] }
  return (
    <div className="card" style={{ padding: 10, background: 'var(--bg-surface)' }}>
      <div style={{ fontSize: 10, color: '#00d4aa', fontWeight: 700, marginBottom: 4 }}>★ NORTH STAR METRIC</div>
      <input style={inp} value={m.northStar} placeholder="The one metric that captures core value delivered" onChange={e => onChange({ ...m, northStar: e.target.value })} />
      <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, margin: '10px 0 4px' }}>⚠ GUARDRAIL / TRADE-OFF METRICS</div>
      <ListField value={m.guardrails} onChange={v => onChange({ ...m, guardrails: v })} placeholder="Metric you must not harm while optimizing..." accent={accent} />
    </div>
  )
}

// ── Time-to-Prototype timer ───────────────────────────────────────────
type TimerVal = { elapsedMs: number; running: boolean; startedAt: number | null }
function TimerField({ value, onChange, accent }: { value?: TimerVal; onChange: (v: TimerVal) => void; accent: string }) {
  const t = value ?? { elapsedMs: 0, running: false, startedAt: null }
  // live tick handled by parent re-render; compute current display
  const display = t.running && t.startedAt ? t.elapsedMs + (Date.now() - t.startedAt) : t.elapsedMs
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60
    return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return (
    <div className="card" style={{ padding: 14, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums', minWidth: 130 }}>{fmt(display)}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!t.running
          ? <button onClick={() => onChange({ ...t, running: true, startedAt: Date.now() })} style={{ ...timerBtn, color: '#00d4aa', borderColor: '#00d4aa50' }}>▶ Start</button>
          : <button onClick={() => onChange({ elapsedMs: display, running: false, startedAt: null })} style={{ ...timerBtn, color: '#f59e0b', borderColor: '#f59e0b50' }}>⏸ Pause</button>}
        <button onClick={() => onChange({ elapsedMs: 0, running: false, startedAt: null })} style={{ ...timerBtn, color: '#f43f5e', borderColor: '#f43f5e50' }}>↺ Reset</button>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{t.running ? 'Building… timer runs while modal is open' : 'Track how fast you ship a working prototype'}</div>
    </div>
  )
}

const miniInp: React.CSSProperties = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 3, padding: '5px 7px', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }
const rmBtn: React.CSSProperties = { width: 24, flexShrink: 0, background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: 16 }
const addBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'transparent', border: '1px solid', cursor: 'pointer', marginTop: 2 }
const timerBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid', cursor: 'pointer' }

export type { Data }
