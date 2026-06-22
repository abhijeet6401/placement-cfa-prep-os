'use client'

import { useState } from 'react'
import { ScheduledTask, Track } from '@/lib/types'

const TRACK_META: Record<Track, { label: string; color: string; emoji: string }> = {
  dataml:      { label: 'Data / ML / GenAI', color: '#3b82f6', emoji: '🔷' },
  finance:     { label: 'Finance / CFA',      color: '#f59e0b', emoji: '📈' },
  consulting:  { label: 'Consulting',         color: '#00d4aa', emoji: '♟️' },
  pm:          { label: 'Product Mgmt',       color: '#8b5cf6', emoji: '🎯' },
  foundation:  { label: 'Foundation',         color: '#64748b', emoji: '🧠' },
}

const PRIORITY_COLOR = { high: '#f43f5e', medium: '#f59e0b', low: '#64748b' }

interface Props {
  tasks: ScheduledTask[]
  date: string
  activeTrack: Track | 'all'
  onToggle: (task: ScheduledTask, completed: boolean) => void
}

export default function TaskList({ tasks, date, activeTrack, onToggle }: Props) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack)

  const grouped = filtered.reduce<Record<Track, ScheduledTask[]>>((acc, t) => {
    if (!acc[t.track]) acc[t.track] = []
    acc[t.track].push(t)
    return acc
  }, {} as Record<Track, ScheduledTask[]>)

  const completedCount = filtered.filter(t => t.completed).length
  const totalCount = filtered.length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="terminal-label">Today&apos;s Tasks · {date}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: '#00d4aa', fontWeight: 600 }}>{completedCount}</span>/{totalCount} done
        </div>
      </div>

      {Object.entries(grouped).map(([track, trackTasks]) => {
        const meta = TRACK_META[track as Track]
        return (
          <div key={track} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{meta.emoji}</span>
              <span style={{ color: meta.color, fontWeight: 600, fontSize: 12 }}>{meta.label}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div className="flex flex-col gap-2">
              {trackTasks.map(task => (
                <TaskCard key={task.id} task={task} meta={meta} date={date} onToggle={onToggle} />
              ))}
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
          No tasks for this track today.
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, meta, date, onToggle }: {
  task: ScheduledTask
  meta: { label: string; color: string; emoji: string }
  date: string
  onToggle: (task: ScheduledTask, completed: boolean) => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await onToggle(task, !task.completed)
    setLoading(false)
  }

  return (
    <div
      className="card p-3 flex gap-3 items-start cursor-pointer group"
      style={{
        borderColor: task.completed ? meta.color + '40' : 'var(--border)',
        background: task.completed ? meta.color + '08' : 'var(--bg-surface)',
        transition: 'all 0.15s ease',
        opacity: loading ? 0.6 : 1,
      }}
      onClick={handleToggle}
    >
      {/* Checkbox */}
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
        border: `2px solid ${task.completed ? meta.color : 'var(--border-bright)'}`,
        background: task.completed ? meta.color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}>
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-start justify-between gap-2">
          <div style={{
            fontWeight: 600, fontSize: 13,
            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: task.completed ? 'line-through' : 'none',
          }}>
            {task.title}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 3,
              background: PRIORITY_COLOR[task.priority] + '20',
              color: PRIORITY_COLOR[task.priority],
              fontWeight: 600,
            }}>
              {task.priority.toUpperCase()}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.durationHours}h</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
          {task.description}
        </div>
        {task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {task.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 3,
                background: 'var(--bg-elevated)', color: 'var(--text-dim)',
                border: '1px solid var(--border)',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
