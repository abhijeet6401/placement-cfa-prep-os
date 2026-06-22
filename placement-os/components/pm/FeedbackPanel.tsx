'use client'

import { FAILURE_TAGS, PM_ROUNDS } from '@/lib/pm-config'

interface RawEntry { id: number; round: string; title: string; feedback: string; feedback_tags: string }

function safeJson<T>(s: string, f: T): T { try { return JSON.parse(s) } catch { return f } }

export default function FeedbackPanel({ entries, onJump }: { entries: RawEntry[]; onJump: (round: string) => void }) {
  // Aggregate failure-mode tag frequency (exclude the positive tag)
  const tagCounts: Record<string, number> = {}
  entries.forEach(e => safeJson<string[]>(e.feedback_tags, []).forEach(t => { tagCounts[t] = (tagCounts[t] ?? 0) + 1 }))
  const failureModes = FAILURE_TAGS.filter(t => !t.startsWith('Strong'))
  const maxCount = Math.max(1, ...failureModes.map(t => tagCounts[t] ?? 0))

  const withFeedback = entries.filter(e => e.feedback || safeJson<string[]>(e.feedback_tags, []).length)
  const roundName = (id: string) => PM_ROUNDS.find(r => r.id === id)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
      {/* Failure-mode frequency */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Failure Modes</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Tagged across all mock feedback — attack the top ones</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {failureModes.map(t => {
            const n = tagCounts[t] ?? 0
            return (
              <div key={t}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: n > 0 ? 'var(--text-primary)' : 'var(--text-dim)' }}>{t}</span>
                  <span style={{ color: n > 0 ? '#f43f5e' : 'var(--text-dim)', fontWeight: 600 }}>{n}</span>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${(n / maxCount) * 100}%`, height: '100%', background: '#f43f5e' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent feedback log */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Feedback Log</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>{withFeedback.length} entries with mock / peer feedback</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflow: 'auto' }}>
          {withFeedback.map(e => {
            const r = roundName(e.round); const tags = safeJson<string[]>(e.feedback_tags, [])
            return (
              <div key={e.id} onClick={() => onJump(e.round)} style={{ cursor: 'pointer', borderLeft: `2px solid ${r?.color ?? '#888'}`, paddingLeft: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span>{r?.icon}</span>
                  <span style={{ color: r?.color, fontWeight: 600 }}>{r?.short}</span>
                  <span style={{ color: 'var(--text-muted)' }}>· {e.title || 'Untitled'}</span>
                </div>
                {e.feedback && <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 3 }}>{e.feedback}</div>}
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {tags.map(t => { const good = t.startsWith('Strong'); const tc = good ? '#00d4aa' : '#f43f5e'
                      return <span key={t} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3, background: tc + '18', color: tc, fontWeight: 600 }}>{t}</span> })}
                  </div>
                )}
              </div>
            )
          })}
          {withFeedback.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No feedback logged yet. Add feedback inside any round entry.</div>}
        </div>
      </div>
    </div>
  )
}
