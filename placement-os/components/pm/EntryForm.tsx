'use client'

import { useEffect, useState } from 'react'
import { RoundConfig, CONFIDENCE_LEVELS, FAILURE_TAGS } from '@/lib/pm-config'
import { FieldRenderer } from './fields'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal } from './ui'

export interface PMEntry {
  id: number
  round: string
  title: string
  data: Record<string, unknown>
  confidence: number
  feedback: string
  feedback_tags: string[]
}

export function emptyEntry(round: string): PMEntry {
  return { id: 0, round, title: '', data: {}, confidence: 1, feedback: '', feedback_tags: [] }
}

export default function EntryForm({ round, entry, onSave, onCancel }: {
  round: RoundConfig; entry: PMEntry; onSave: (e: PMEntry) => void; onCancel: () => void
}) {
  const [e, setE] = useState<PMEntry>(entry)
  const [, force] = useState(0)

  // Live timer tick while any field is a running timer
  useEffect(() => {
    const hasRunningTimer = round.fields.some(f => {
      if (f.type !== 'timer') return false
      const t = e.data[f.key] as { running?: boolean } | undefined
      return t?.running
    })
    if (!hasRunningTimer) return
    const id = setInterval(() => force(n => n + 1), 500)
    return () => clearInterval(id)
  }, [e.data, round.fields])

  const setData = (key: string, v: unknown) => setE(p => ({ ...p, data: { ...p.data, [key]: v } }))
  const toggleTag = (tag: string) =>
    setE(p => ({ ...p, feedback_tags: p.feedback_tags.includes(tag) ? p.feedback_tags.filter(t => t !== tag) : [...p.feedback_tags, tag] }))

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={ev => ev.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>{round.icon}</span>
          <div style={{ fontWeight: 700, fontSize: 16, color: round.color }}>{round.name}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>{round.objective}</div>

        {/* Title */}
        <label style={{ display: 'block', marginBottom: 12 }}>
          <div className="terminal-label" style={{ marginBottom: 4 }}>Entry Title</div>
          <input style={inp} value={e.title} placeholder="e.g. Practice case #3 — Spotify for podcasts" onChange={ev => setE(p => ({ ...p, title: ev.target.value }))} />
        </label>

        {/* Round-specific fields */}
        {round.fields.map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <div className="terminal-label" style={{ marginBottom: 4 }}>{f.label}</div>
            <FieldRenderer field={f} value={e.data[f.key]} onChange={v => setData(f.key, v)} accent={round.color} />
          </div>
        ))}

        {/* Confidence */}
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div className="terminal-label" style={{ marginBottom: 6 }}>Self-Assessed Confidence</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {CONFIDENCE_LEVELS.map(c => (
              <button key={c.v} onClick={() => setE(p => ({ ...p, confidence: c.v }))} style={{
                flex: 1, padding: '8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: e.confidence === c.v ? c.color + '20' : 'var(--bg-surface)',
                border: `1px solid ${e.confidence === c.v ? c.color : 'var(--border)'}`,
                color: e.confidence === c.v ? c.color : 'var(--text-muted)',
              }}>{c.label}</button>
            ))}
          </div>
        </div>

        {/* AI / peer feedback */}
        <div style={{ marginTop: 16 }}>
          <div className="terminal-label" style={{ marginBottom: 4 }}>Mock Interviewer / AI Feedback</div>
          <textarea style={textarea} value={e.feedback} placeholder="Paste feedback from your mock interviewer or peer evaluator..." onChange={ev => setE(p => ({ ...p, feedback: ev.target.value }))} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
            {FAILURE_TAGS.map(tag => {
              const on = e.feedback_tags.includes(tag)
              const good = tag.startsWith('Strong')
              const c = good ? '#00d4aa' : '#f43f5e'
              return (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 4, fontWeight: 600, cursor: 'pointer',
                  background: on ? c + '20' : 'var(--bg-surface)',
                  border: `1px solid ${on ? c + '60' : 'var(--border)'}`,
                  color: on ? c : 'var(--text-muted)',
                }}>{tag}</button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(e)} style={{ ...btnPrimary, background: round.color + '20', borderColor: round.color + '50', color: round.color }}>Save Entry</button>
        </div>
      </div>
    </div>
  )
}
