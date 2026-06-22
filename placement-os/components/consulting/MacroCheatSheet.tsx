'use client'

import { useEffect, useState } from 'react'
import { inp, btnPrimary, btnGhost, label } from './ui'

interface Macro { id: number; label: string; value: string; unit: string; source: string }

export default function MacroCheatSheet() {
  const [rows, setRows] = useState<Macro[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Macro | null>(null)

  function load() { fetch('/api/consulting/macro').then(r => r.json()).then(setRows) }
  useEffect(load, [])

  async function add() {
    await fetch('/api/consulting/macro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: 'New metric', value: '', unit: '', source: '' }) })
    load()
  }
  async function save(m: Macro) {
    await fetch('/api/consulting/macro', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) })
    setEditId(null); setDraft(null); load()
  }
  async function del(id: number) { await fetch(`/api/consulting/macro?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label}>Quick-reference economic indicators for casing · seeded with India data points (edit & verify before exam)</div>
        <button onClick={add} style={btnPrimary}>+ Add Metric</button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 70px', gap: 0, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <span>Indicator</span><span>Value</span><span>Unit</span><span>Source / Note</span><span></span>
        </div>
        {rows.map(m => {
          const editing = editId === m.id
          const d = editing ? draft! : m
          return (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 70px', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              {editing ? (
                <>
                  <input style={cell} value={d.label} onChange={e => setDraft({ ...d, label: e.target.value })} />
                  <input style={cell} value={d.value} onChange={e => setDraft({ ...d, value: e.target.value })} />
                  <input style={cell} value={d.unit} onChange={e => setDraft({ ...d, unit: e.target.value })} />
                  <input style={cell} value={d.source} onChange={e => setDraft({ ...d, source: e.target.value })} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => save(d)} style={{ ...miniBtn, color: '#00d4aa' }}>✓</button>
                    <button onClick={() => { setEditId(null); setDraft(null) }} style={{ ...miniBtn, color: 'var(--text-muted)' }}>×</button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa', fontVariantNumeric: 'tabular-nums' }}>{m.value || '—'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.unit}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{m.source}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => { setEditId(m.id); setDraft(m) }} style={{ ...miniBtn, color: 'var(--text-muted)' }}>✎</button>
                    <button onClick={() => del(m.id)} style={{ ...miniBtn, color: '#f43f5e' }}>×</button>
                  </div>
                </>
              )}
            </div>
          )
        })}
        {rows.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Loading…</div>}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>⚠ Seeded values are approximate. Verify current figures (repo rate, UPI volumes, CPI) closer to your interviews.</div>
    </div>
  )
}

const cell: React.CSSProperties = { ...inp, fontSize: 12, padding: '4px 7px' }
const miniBtn: React.CSSProperties = { width: 26, height: 26, borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 12 }
