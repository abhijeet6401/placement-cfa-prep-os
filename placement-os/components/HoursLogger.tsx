'use client'

import { useState } from 'react'
import ProgressRing from './ProgressRing'

interface Props {
  logged: number
  capacity: number
  date: string
  onUpdate: (hours: number) => void
}

const QUICK_ADD = [0.5, 1, 1.5, 2]

export default function HoursLogger({ logged, capacity, date, onUpdate }: Props) {
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(hrs: number) {
    const newTotal = Math.max(0, logged + hrs)
    setSaving(true)
    await fetch('/api/hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, logged_hours: newTotal, track_breakdown: {} }),
    })
    onUpdate(newTotal)
    setSaving(false)
  }

  return (
    <div className="card p-4 flex flex-col items-center gap-4">
      <div className="terminal-label">Daily Hours</div>
      <ProgressRing logged={logged} capacity={capacity} size={130} />

      <div className="flex gap-2">
        {QUICK_ADD.map(h => (
          <button
            key={h}
            onClick={() => save(h)}
            disabled={saving}
            style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
              color: 'var(--text-primary)', cursor: 'pointer',
            }}
          >
            +{h}h
          </button>
        ))}
      </div>

      <div className="flex gap-2 w-full">
        <input
          type="number" step="0.25" min="0" max="24"
          placeholder="Custom hrs"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
            borderRadius: 4, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 12,
            outline: 'none',
          }}
        />
        <button
          onClick={() => { if (input) { save(parseFloat(input)); setInput('') } }}
          disabled={saving || !input}
          style={{
            padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 600,
            background: '#00d4aa20', border: '1px solid #00d4aa50',
            color: '#00d4aa', cursor: 'pointer',
          }}
        >
          Log
        </button>
      </div>

      {logged >= capacity && (
        <div style={{ fontSize: 11, color: '#00d4aa', fontWeight: 600 }}>
          ✓ Daily target hit!
        </div>
      )}
    </div>
  )
}
