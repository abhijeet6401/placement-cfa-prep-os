'use client'

import { useEffect, useState } from 'react'

interface Signal {
  id: number
  strategy_name: string
  run_date: string
  sharpe: number | null
  fitness: number | null
  returns: number | null
  max_drawdown: number | null
  universe: string
  notes: string
}

export default function QuantSignalTracker() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [adding, setAdding] = useState(false)

  function load() { fetch('/api/quant').then(r => r.json()).then(setSignals) }
  useEffect(load, [])

  async function save(s: Partial<Signal>) {
    await fetch('/api/quant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
    setAdding(false); load()
  }
  async function del(id: number) {
    await fetch(`/api/quant?id=${id}`, { method: 'DELETE' }); load()
  }

  // Group by strategy for best-of stats & trend
  const byStrategy = signals.reduce<Record<string, Signal[]>>((acc, s) => {
    (acc[s.strategy_name] ||= []).push(s); return acc
  }, {})

  const bestSharpe = Math.max(0, ...signals.map(s => s.sharpe ?? 0))
  const bestFitness = Math.max(0, ...signals.map(s => s.fitness ?? 0))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="terminal-label">Backtest log · track Sharpe & Fitness improvement</div>
        <button onClick={() => setAdding(true)} style={btnPrimary}>+ Log Backtest</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <Kpi label="Best Sharpe" value={bestSharpe ? bestSharpe.toFixed(2) : '—'} color="#00d4aa" />
        <Kpi label="Best Fitness" value={bestFitness ? bestFitness.toFixed(2) : '—'} color="#3b82f6" />
        <Kpi label="Total Runs" value={String(signals.length)} color="#f59e0b" />
      </div>

      {/* Per-strategy trend */}
      {Object.entries(byStrategy).map(([name, runs]) => {
        const sorted = [...runs].sort((a, b) => a.run_date.localeCompare(b.run_date))
        return (
          <div key={name} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{runs.length} runs</span>
            </div>
            <Sparkline runs={sorted} metric="sharpe" color="#00d4aa" />
            {/* Run rows */}
            <table style={{ width: '100%', marginTop: 12, fontSize: 11.5, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={th}>Date</th><th style={th}>Sharpe</th><th style={th}>Fitness</th>
                  <th style={th}>Return%</th><th style={th}>Max DD%</th><th style={th}>Universe</th><th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice().reverse().map((s, i, arr) => {
                  const prev = arr[i + 1]
                  const sharpeDelta = prev && s.sharpe != null && prev.sharpe != null ? s.sharpe - prev.sharpe : null
                  return (
                    <tr key={s.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={td}>{s.run_date}</td>
                      <td style={td}>
                        <span style={{ color: '#00d4aa', fontWeight: 600 }}>{s.sharpe?.toFixed(2) ?? '—'}</span>
                        {sharpeDelta != null && sharpeDelta !== 0 && (
                          <span style={{ fontSize: 10, marginLeft: 4, color: sharpeDelta > 0 ? '#00d4aa' : '#f43f5e' }}>
                            {sharpeDelta > 0 ? '▲' : '▼'}{Math.abs(sharpeDelta).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td style={td}>{s.fitness?.toFixed(2) ?? '—'}</td>
                      <td style={{ ...td, color: (s.returns ?? 0) >= 0 ? '#00d4aa' : '#f43f5e' }}>{s.returns?.toFixed(1) ?? '—'}</td>
                      <td style={{ ...td, color: '#f43f5e' }}>{s.max_drawdown?.toFixed(1) ?? '—'}</td>
                      <td style={{ ...td, color: 'var(--text-muted)' }}>{s.universe || '—'}</td>
                      <td style={td}><button onClick={() => del(s.id)} style={{ ...btnGhost, padding: '2px 8px', color: '#f43f5e' }}>×</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
      {signals.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
          No backtests logged. Record each alpha-model run to track Sharpe & Fitness improvements over time.
        </div>
      )}

      {adding && <SignalEditor onSave={save} onCancel={() => setAdding(false)} />}
    </div>
  )
}

function Sparkline({ runs, metric, color }: { runs: Signal[]; metric: keyof Signal; color: string }) {
  const vals = runs.map(r => (r[metric] as number) ?? 0)
  if (vals.length < 2) return <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Log ≥2 runs to see trend</div>
  const max = Math.max(...vals), min = Math.min(...vals)
  const range = max - min || 1
  const w = 100, h = 28
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 32 }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      {vals.map((v, i) => (
        <circle key={i} cx={(i / (vals.length - 1)) * w} cy={h - ((v - min) / range) * h} r={1.5} fill={color} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

function Kpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div className="terminal-label" style={{ marginTop: 4 }}>{label}</div>
    </div>
  )
}

function SignalEditor({ onSave, onCancel }: { onSave: (s: Partial<Signal>) => void; onCancel: () => void }) {
  const [s, setS] = useState<Partial<Signal>>({ run_date: new Date().toISOString().split('T')[0] })
  const set = (k: keyof Signal, v: unknown) => setS(p => ({ ...p, [k]: v }))
  const num = (v: string) => v ? parseFloat(v) : null
  return (
    <div style={overlay} onClick={onCancel}>
      <div className="card-elevated" style={{ ...modal, background: 'var(--bg-elevated)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Log Backtest Run</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Strategy Name"><input style={inp} value={s.strategy_name ?? ''} onChange={e => set('strategy_name', e.target.value)} placeholder="Momentum + value composite" /></Field>
          <Field label="Run Date"><input type="date" style={inp} value={s.run_date ?? ''} onChange={e => set('run_date', e.target.value)} /></Field>
          <Field label="Sharpe"><input type="number" step="0.01" style={inp} onChange={e => set('sharpe', num(e.target.value))} /></Field>
          <Field label="Fitness"><input type="number" step="0.01" style={inp} onChange={e => set('fitness', num(e.target.value))} /></Field>
          <Field label="Return %"><input type="number" step="0.1" style={inp} onChange={e => set('returns', num(e.target.value))} /></Field>
          <Field label="Max Drawdown %"><input type="number" step="0.1" style={inp} onChange={e => set('max_drawdown', num(e.target.value))} /></Field>
          <Field label="Universe"><input style={inp} onChange={e => set('universe', e.target.value)} placeholder="NIFTY 500" /></Field>
        </div>
        <div style={{ height: 10 }} />
        <Field label="Notes"><textarea style={{ ...inp, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }} onChange={e => set('notes', e.target.value)} placeholder="What changed this run? New factor, neutralization, decay handling..." /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(s)} style={btnPrimary}>Save Run</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div className="terminal-label" style={{ marginBottom: 4 }}>{label}</div>{children}</label>
}

const th: React.CSSProperties = { padding: '4px 8px', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '6px 8px' }
const inp: React.CSSProperties = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-bright)', borderRadius: 4, padding: '7px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }
const btnPrimary: React.CSSProperties = { padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: '#00d4aa20', border: '1px solid #00d4aa50', color: '#00d4aa', cursor: 'pointer' }
const btnGhost: React.CSSProperties = { padding: '5px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--text-muted)', cursor: 'pointer' }
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }
const modal: React.CSSProperties = { width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', padding: 24, borderRadius: 10 }
