'use client'

import { useEffect, useState } from 'react'
import { SECTOR_COLORS } from '@/lib/consulting-config'
import { inp, textarea, btnPrimary, btnGhost, label } from './ui'

interface ValueChain { suppliers: string[]; manufacturers: string[]; distributors: string[]; consumers: string[] }
interface Player { name: string; moat: string; whitespace: string }
interface Sector {
  sector: string
  value_chain: ValueChain
  players: Player[]
  notes: string
}
interface Raw { sector: string; value_chain: string; players: string; notes: string }

const EMPTY_VC: ValueChain = { suppliers: [], manufacturers: [], distributors: [], consumers: [] }

function parse(r: Raw): Sector {
  return { sector: r.sector, value_chain: safe(r.value_chain, EMPTY_VC), players: safe(r.players, [] as Player[]), notes: r.notes }
}
function safe<T>(s: string, f: T): T { try { return { ...f, ...JSON.parse(s) } as T } catch { return f } }

export default function SectorVault() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [active, setActive] = useState<string>('')
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/consulting/sectors').then(r => r.json()).then((rows: Raw[]) => {
      const parsed = rows.map(parse)
      setSectors(parsed)
      if (parsed.length && !active) setActive(parsed[0].sector)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cur = sectors.find(s => s.sector === active)
  const accent = SECTOR_COLORS[active] ?? '#3b82f6'

  function update(patch: Partial<Sector>) {
    setSectors(prev => prev.map(s => s.sector === active ? { ...s, ...patch } : s))
    setDirty(true); setSaved(false)
  }
  async function save() {
    if (!cur) return
    await fetch('/api/consulting/sectors', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cur) })
    setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  if (!cur) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading sectors…</div>

  const vc = cur.value_chain
  const chainStages: { key: keyof ValueChain; label: string }[] = [
    { key: 'suppliers', label: 'Suppliers' },
    { key: 'manufacturers', label: 'Manufacturers' },
    { key: 'distributors', label: 'Distributors' },
    { key: 'consumers', label: 'End Consumers' },
  ]

  return (
    <div>
      {/* Sector sub-tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {sectors.map(s => {
          const c = SECTOR_COLORS[s.sector] ?? '#3b82f6'
          const on = s.sector === active
          return (
            <button key={s.sector} onClick={() => setActive(s.sector)} style={{
              padding: '7px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: on ? c + '20' : 'var(--bg-surface)', border: `1px solid ${on ? c + '70' : 'var(--border)'}`,
              color: on ? c : 'var(--text-muted)',
            }}>{s.sector}</button>
          )
        })}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {saved && <span style={{ fontSize: 11, color: '#00d4aa' }}>✓ Saved</span>}
          <button onClick={save} disabled={!dirty} style={{ ...btnPrimary, opacity: dirty ? 1 : 0.4, background: accent + '20', borderColor: accent + '50', color: accent }}>Save Sector</button>
        </div>
      </div>

      {/* Value Chain Mapper */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ ...label, marginBottom: 12 }}>Value Chain Mapper</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          {chainStages.map((stage, i) => (
            <div key={stage.key} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }} className="card">
                <div style={{ padding: '6px 10px', background: accent + '12', borderBottom: `1px solid ${accent}30`, fontSize: 11, fontWeight: 700, color: accent, borderRadius: '8px 8px 0 0' }}>{stage.label}</div>
                <div style={{ padding: 8 }}>
                  <TagEditor items={vc[stage.key]} onChange={items => update({ value_chain: { ...vc, [stage.key]: items } })} accent={accent} />
                </div>
              </div>
              {i < chainStages.length - 1 && <span style={{ color: 'var(--text-dim)', fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Benchmarking */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={label}>Competitive Benchmarking · Players · Moats · White Space</div>
          <button onClick={() => update({ players: [...cur.players, { name: '', moat: '', whitespace: '' }] })} style={{ ...btnGhost, fontSize: 11, padding: '3px 10px', color: accent, borderColor: accent + '50' }}>+ Add Player</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr 28px', gap: 8, fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
          <span>Key Player</span><span>Moat (Competitive Advantage)</span><span>White Space Opportunity</span><span></span>
        </div>
        {cur.players.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr 28px', gap: 8, marginBottom: 6 }}>
            <input style={inp} value={p.name} placeholder="Company" onChange={e => updatePlayer(i, 'name', e.target.value)} />
            <input style={inp} value={p.moat} placeholder="Network effects, scale, IP..." onChange={e => updatePlayer(i, 'moat', e.target.value)} />
            <input style={inp} value={p.whitespace} placeholder="Underserved segment / entry angle" onChange={e => updatePlayer(i, 'whitespace', e.target.value)} />
            <button onClick={() => update({ players: cur.players.filter((_, j) => j !== i) })} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        ))}
        {cur.players.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '12px 0' }}>No players mapped. Add the key incumbents and the white space between them.</div>}
      </div>

      {/* Notes */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ ...label, marginBottom: 8 }}>Opinionated Notes / Thesis</div>
        <textarea style={{ ...textarea, minHeight: 90 }} value={cur.notes} placeholder={`Your point of view on ${active} — where is value migrating? What would you tell a partner?`} onChange={e => update({ notes: e.target.value })} />
      </div>
    </div>
  )

  function updatePlayer(i: number, k: keyof Player, v: string) {
    const players = cur!.players.map((p, j) => j === i ? { ...p, [k]: v } : p)
    update({ players })
  }
}

function TagEditor({ items, onChange, accent }: { items: string[]; onChange: (v: string[]) => void; accent: string }) {
  const [val, setVal] = useState('')
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        {items.map((it, i) => (
          <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: accent + '18', color: accent, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {it}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: accent, cursor: 'pointer', padding: 0, fontSize: 11 }}>×</button>
          </span>
        ))}
      </div>
      <input
        style={{ ...inp, fontSize: 11, padding: '4px 7px' }}
        value={val}
        placeholder="+ add, Enter"
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) { onChange([...items, val.trim()]); setVal('') } }}
      />
    </div>
  )
}
