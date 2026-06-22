'use client'

import { useEffect, useState } from 'react'
import { CFA_CURRICULUM, TOTAL_READINGS } from '@/lib/cfa-curriculum'

type Status = 'not_started' | 'reading' | 'practiced' | 'mastered'

interface Progress {
  reading_id: string
  topic_id: string
  status: Status
  confidence: number
  notes: string
}

const STATUS_META: Record<Status, { label: string; color: string }> = {
  not_started: { label: 'Not Started', color: '#475569' },
  reading:     { label: 'Reading',     color: '#3b82f6' },
  practiced:   { label: 'Practiced',   color: '#f59e0b' },
  mastered:    { label: 'Mastered',    color: '#00d4aa' },
}

const STATUS_CYCLE: Status[] = ['not_started', 'reading', 'practiced', 'mastered']
const RELEVANCE_BADGE = { high: '#00d4aa', medium: '#f59e0b', low: '#475569' }

export default function CFATracker() {
  const [progress, setProgress] = useState<Record<string, Progress>>({})
  const [open, setOpen] = useState<Record<string, boolean>>({ quant: true })

  useEffect(() => {
    fetch('/api/cfa').then(r => r.json()).then((rows: Progress[]) => {
      const map: Record<string, Progress> = {}
      rows.forEach(r => { map[r.reading_id] = r })
      setProgress(map)
    })
  }, [])

  async function cycleStatus(readingId: string, topicId: string) {
    const cur = progress[readingId]?.status ?? 'not_started'
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length]
    const conf = next === 'mastered' ? 5 : next === 'practiced' ? 3 : next === 'reading' ? 1 : 0
    const updated: Progress = { reading_id: readingId, topic_id: topicId, status: next, confidence: conf, notes: progress[readingId]?.notes ?? '' }
    setProgress(p => ({ ...p, [readingId]: updated }))
    await fetch('/api/cfa', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  // Stats
  const masteredCount = Object.values(progress).filter(p => p.status === 'mastered').length
  const touchedCount = Object.values(progress).filter(p => p.status !== 'not_started').length
  const overallPct = Math.round((masteredCount / TOTAL_READINGS) * 100)

  return (
    <div>
      {/* Summary bar */}
      <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>{overallPct}%</div>
          <div className="terminal-label" style={{ marginTop: 4 }}>Mastered</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>{masteredCount} mastered · {touchedCount} in progress</span>
            <span>{TOTAL_READINGS} readings total</span>
          </div>
          <div style={{ background: '#1e2a3a', borderRadius: 4, height: 8, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(masteredCount / TOTAL_READINGS) * 100}%`, background: '#00d4aa' }} />
            <div style={{ width: `${((touchedCount - masteredCount) / TOTAL_READINGS) * 100}%`, background: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* Topics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CFA_CURRICULUM.map(topic => {
          const readings = topic.readings
          const topicMastered = readings.filter(r => progress[r.id]?.status === 'mastered').length
          const topicPct = Math.round((topicMastered / readings.length) * 100)
          const isOpen = open[topic.id]

          return (
            <div key={topic.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Topic header */}
              <button
                onClick={() => setOpen(o => ({ ...o, [topic.id]: !o[topic.id] }))}
                style={{
                  width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: 12, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▶</span>
                <div style={{ width: 3, height: 24, background: topic.color, borderRadius: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{topic.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    Exam weight {topic.weightLow}–{topic.weightHigh}% · {readings.length} readings
                  </div>
                </div>
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 3, fontWeight: 600,
                  background: RELEVANCE_BADGE[topic.interviewRelevance] + '20',
                  color: RELEVANCE_BADGE[topic.interviewRelevance],
                }}>
                  {topic.interviewRelevance.toUpperCase()} INTERVIEW
                </span>
                <div style={{ width: 90, textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: topic.color }}>{topicPct}%</div>
                  <div style={{ background: '#1e2a3a', borderRadius: 3, height: 4, marginTop: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${topicPct}%`, height: '100%', background: topic.color }} />
                  </div>
                </div>
              </button>

              {/* Readings */}
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {readings.map(reading => {
                    const st = progress[reading.id]?.status ?? 'not_started'
                    const meta = STATUS_META[st]
                    return (
                      <div key={reading.id} style={{ padding: '10px 16px 10px 44px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <button
                            onClick={() => cycleStatus(reading.id, topic.id)}
                            style={{
                              flexShrink: 0, marginTop: 1, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                              padding: '3px 8px', borderRadius: 4, minWidth: 90, textAlign: 'center',
                              background: meta.color + '20', color: meta.color,
                              border: `1px solid ${meta.color}40`,
                            }}
                          >
                            {meta.label}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: st === 'mastered' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                              {reading.title}
                            </div>
                            <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none' }}>
                              {reading.los.map((lo, i) => (
                                <li key={i} style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 12, position: 'relative', marginBottom: 2 }}>
                                  <span style={{ position: 'absolute', left: 0, color: topic.color }}>·</span>
                                  {lo}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 12, textAlign: 'center' }}>
        Click a status badge to cycle: Not Started → Reading → Practiced → Mastered. Progress auto-saves.
      </div>
    </div>
  )
}
