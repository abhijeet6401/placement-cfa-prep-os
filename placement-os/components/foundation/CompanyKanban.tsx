'use client'

import { useEffect, useState } from 'react'
import { TIERS, TRACKS, COMPANY_STATUS } from '@/lib/foundation-config'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Company {
  id: number; name: string; tier: string; track: string; status: string; notes: string
}
function empty(tier: string): Company { return { id: 0, name: '', tier, track: 'all', status: 'target', notes: '' } }

const track = (id: string) => TRACKS.find(t => t.id === id) ?? TRACKS[0]
const cstatus = (id: string) => COMPANY_STATUS.find(s => s.id === id) ?? COMPANY_STATUS[0]

export default function CompanyKanban() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [editing, setEditing] = useState<Company | null>(null)
  const [trackFilter, setTrackFilter] = useState('all-tracks')

  function load() { fetch('/api/companies').then(r => r.json()).then(setCompanies) }
  useEffect(load, [])

  async function save(c: Company) {
    await fetch('/api/companies', { method: c.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
    setEditing(null); load()
  }
  async function moveTier(c: Company, tier: string) {
    const updated = { ...c, tier }
    setCompanies(prev => prev.map(x => x.id === c.id ? updated : x))
    await fetch('/api/companies', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
  }
  async function del(id: number) { if (!confirm('Remove company?')) return; await fetch(`/api/companies?id=${id}`, { method: 'DELETE' }); load() }

  const filtered = trackFilter === 'all-tracks' ? companies : companies.filter(c => c.track === trackFilter)

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <FilterChip label="All Tracks" active={trackFilter === 'all-tracks'} color="#e2e8f0" onClick={() => setTrackFilter('all-tracks')} />
          {TRACKS.map(t => <FilterChip key={t.id} label={t.label} active={trackFilter === t.id} color={t.color} onClick={() => setTrackFilter(t.id)} />)}
        </div>
        <button onClick={() => setEditing(empty('day1'))} style={btnPrimary}>+ Add Company</button>
      </div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {TIERS.map(tier => {
          const items = filtered.filter(c => c.tier === tier.id)
          return (
            <div key={tier.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, paddingBottom: 8, borderBottom: `2px solid ${tier.color}` }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: tier.color }}>{tier.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 8, padding: '0 7px' }}>{items.length}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 10 }}>{tier.desc}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                {items.map(c => {
                  const tr = track(c.track); const stt = cstatus(c.status)
                  const otherTiers = TIERS.filter(t => t.id !== c.tier)
                  return (
                    <div key={c.id} className="card" style={{ padding: 12, borderLeft: `3px solid ${tr.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: stt.color + '20', color: stt.color, height: 'fit-content', whiteSpace: 'nowrap' }}>{stt.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: tr.color }}>{tr.label}</span>
                      </div>
                      {c.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.4 }}>{c.notes}</div>}
                      <div style={{ display: 'flex', gap: 4, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {otherTiers.map(t => (
                          <button key={t.id} onClick={() => moveTier(c, t.id)} title={`Move to ${t.label}`} style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 3, background: 'var(--bg-elevated)', border: `1px solid ${t.color}40`, color: t.color, cursor: 'pointer' }}>→ {t.label}</button>
                        ))}
                        <button onClick={() => setEditing(c)} style={miniBtn}>✎</button>
                        <button onClick={() => del(c.id)} style={{ ...miniBtn, color: '#f43f5e' }}>×</button>
                      </div>
                    </div>
                  )
                })}
                {items.length === 0 && <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', padding: '16px 0', border: '1px dashed var(--border)', borderRadius: 6 }}>No companies</div>}
              </div>
            </div>
          )
        })}
      </div>

      {editing && <CompanyEditor company={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function CompanyEditor({ company, onSave, onCancel }: { company: Company; onSave: (c: Company) => void; onCancel: () => void }) {
  const [c, setC] = useState(company)
  const set = (k: keyof Company, v: unknown) => setC(p => ({ ...p, [k]: v }))
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{c.id ? 'Edit' : 'Add'} Company</div>
        <Field l="Company Name"><input style={inp} value={c.name} placeholder="e.g. McKinsey & Company" onChange={e => set('name', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Field l="Tier">
            <select style={inp} value={c.tier} onChange={e => set('tier', e.target.value)}>
              {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </Field>
          <Field l="Track">
            <select style={inp} value={c.track} onChange={e => set('track', e.target.value)}>
              {TRACKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </Field>
          <Field l="Status">
            <select style={inp} value={c.status} onChange={e => set('status', e.target.value)}>
              {COMPANY_STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ height: 10 }} />
        <Field l="Notes"><textarea style={textarea} value={c.notes} placeholder="Role, contacts, deadlines, why this tier..." onChange={e => set('notes', e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(c)} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 11px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
      background: active ? color + '20' : 'var(--bg-surface)', border: `1px solid ${active ? color + '60' : 'var(--border)'}`,
      color: active ? color : 'var(--text-muted)',
    }}>{label}</button>
  )
}
function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
const miniBtn: React.CSSProperties = { width: 24, height: 20, borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }
