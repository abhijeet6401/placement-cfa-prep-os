'use client'

import { useEffect, useState } from 'react'
import { RoundConfig, CONFIDENCE_LEVELS } from '@/lib/pm-config'
import EntryForm, { PMEntry, emptyEntry } from './EntryForm'
import { btnPrimary, btnGhost } from './ui'

interface RawEntry {
  id: number; round: string; title: string; data: string;
  confidence: number; feedback: string; feedback_tags: string; updated_at: string
}

function parse(r: RawEntry): PMEntry & { updated_at: string } {
  return {
    id: r.id, round: r.round, title: r.title,
    data: safeJson(r.data, {}), confidence: r.confidence,
    feedback: r.feedback, feedback_tags: safeJson(r.feedback_tags, []),
    updated_at: r.updated_at,
  }
}
function safeJson<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

export default function RoundView({ round, onChanged }: { round: RoundConfig; onChanged?: () => void }) {
  const [entries, setEntries] = useState<(PMEntry & { updated_at: string })[]>([])
  const [editing, setEditing] = useState<PMEntry | null>(null)

  function load() {
    fetch(`/api/pm?round=${round.id}`).then(r => r.json()).then((rows: RawEntry[]) => setEntries(rows.map(parse)))
  }
  useEffect(load, [round.id])

  async function save(e: PMEntry) {
    const method = e.id ? 'PUT' : 'POST'
    await fetch('/api/pm', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(e) })
    setEditing(null); load(); onChanged?.()
  }
  async function del(id: number) {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/pm?id=${id}`, { method: 'DELETE' }); load(); onChanged?.()
  }

  const conf = (v: number) => CONFIDENCE_LEVELS.find(c => c.v === v) ?? CONFIDENCE_LEVELS[0]

  return (
    <div>
      {/* Round header banner */}
      <div className="card" style={{ padding: 16, marginBottom: 16, borderLeft: `3px solid ${round.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{round.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{round.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: round.color + '20', color: round.color }}>{round.audience}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{round.objective}</div>
        </div>
        <button onClick={() => setEditing(emptyEntry(round.id))} style={{ ...btnPrimary, background: round.color + '20', borderColor: round.color + '50', color: round.color }}>+ New Entry</button>
      </div>

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(e => {
          const c = conf(e.confidence)
          return (
            <div key={e.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title || 'Untitled entry'}</div>
                  <Preview round={round} data={e.data} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: c.color + '20', color: c.color }}>{c.label}</span>
                </div>
              </div>

              {/* Feedback tags */}
              {e.feedback_tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {e.feedback_tags.map(t => {
                    const good = t.startsWith('Strong'); const tc = good ? '#00d4aa' : '#f43f5e'
                    return <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: tc + '18', color: tc, fontWeight: 600 }}>{t}</span>
                  })}
                </div>
              )}
              {e.feedback && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>{e.feedback}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setEditing(e)} style={btnGhost}>Open / Edit</button>
                <button onClick={() => del(e.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-dim)', alignSelf: 'center' }}>{e.updated_at?.split(' ')[0]}</span>
              </div>
            </div>
          )
        })}
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            No entries yet. Click <b style={{ color: round.color }}>+ New Entry</b> to log your first {round.short} practice.
          </div>
        )}
      </div>

      {editing && <EntryForm round={round} entry={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

// Compact preview of a couple key fields per entry
function Preview({ round, data }: { round: RoundConfig; data: Record<string, unknown> }) {
  const firstText = round.fields.find(f => (f.type === 'text' || f.type === 'textarea') && data[f.key])
  if (!firstText) return null
  const val = String(data[firstText.key])
  return <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{val}</div>
}
