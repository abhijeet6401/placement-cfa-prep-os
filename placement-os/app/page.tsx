'use client'

import { useEffect, useState } from 'react'
import { DailyPlan, Track } from '@/lib/types'
import { getPhaseInfo, getCFACountdown } from '@/lib/scheduler'
import PhaseBar from '@/components/PhaseBar'
import CFACountdown from '@/components/CFACountdown'
import TrackAllocation from '@/components/TrackAllocation'
import HoursLogger from '@/components/HoursLogger'
import TaskList from '@/components/TaskList'

const TRACK_FILTERS: { key: Track | 'all'; label: string; color: string }[] = [
  { key: 'all',        label: 'All Tracks',    color: '#e2e8f0' },
  { key: 'dataml',     label: 'Data / ML',     color: '#3b82f6' },
  { key: 'finance',    label: 'Finance / CFA', color: '#f59e0b' },
  { key: 'consulting', label: 'Consulting',    color: '#00d4aa' },
  { key: 'pm',         label: 'PM',            color: '#8b5cf6' },
  { key: 'foundation', label: 'Foundation',    color: '#64748b' },
]

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0]
  const phaseInfo = getPhaseInfo(new Date())
  const cfaInfo = getCFACountdown(new Date())

  const [plan, setPlan] = useState<DailyPlan | null>(null)
  const [loggedHours, setLoggedHours] = useState(0)
  const [activeTrack, setActiveTrack] = useState<Track | 'all'>('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetch(`/api/tasks?date=${today}`).then(r => r.json()).then(setPlan)
    fetch(`/api/hours?date=${today}`).then(r => r.json()).then(d => setLoggedHours(d.logged_hours ?? 0))
  }, [today])

  async function handleTaskToggle(task: { id: string; track: Track; completed?: boolean }, completed: boolean) {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, task_id: task.id, track: task.track, completed }),
    })
    const updated = await fetch(`/api/tasks?date=${today}`).then(r => r.json())
    setPlan(updated)
  }

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          width: 220, flexShrink: 0, background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)', padding: '20px 0',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00d4aa', letterSpacing: '0.06em' }}>PREP OS</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Placement & CFA Dashboard</div>
          </div>

          <nav style={{ padding: '12px 8px', flex: 1 }}>
            {[
              { href: '/',           label: 'Dashboard',       icon: '⬛', active: true },
              { href: '/finance',    label: 'Finance & CFA',   icon: '📈', active: false },
              { href: '/dataml',     label: 'Data / ML / AI',  icon: '🔷', active: false },
              { href: '/pm',         label: 'Product Mgmt',    icon: '🎯', active: false },
              { href: '/consulting', label: 'Consulting',      icon: '♟', active: false },
              { href: '/companies',  label: 'Company Matrix',  icon: '🏢', active: false },
              { href: '/resume',     label: 'Resume Defense',  icon: '📄', active: false },
            ].map(item => (
              <a key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', borderRadius: 6, marginBottom: 2,
                fontSize: 12, fontWeight: item.active ? 600 : 400,
                color: item.active ? 'var(--text-primary)' : 'var(--text-muted)',
                background: item.active ? 'var(--bg-elevated)' : 'transparent',
                textDecoration: 'none',
              }}>
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>CFA L1 Exam</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>{cfaInfo.daysRemaining}d</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>Feb 27, 2027</div>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(o => !o)} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '4px 10px', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: 14, lineHeight: 1,
            }}>☰</button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{dayName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dateStr}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
              background: phaseInfo.phase === 'phase1' ? '#3b82f620' : '#00d4aa20',
              color: phaseInfo.phase === 'phase1' ? '#3b82f6' : '#00d4aa',
              border: `1px solid ${phaseInfo.phase === 'phase1' ? '#3b82f640' : '#00d4aa40'}`,
              letterSpacing: '0.08em',
            }}>
              {phaseInfo.phase === 'phase1' ? 'PHASE 1' : phaseInfo.phase === 'phase2' ? 'PHASE 2' : 'POST-PLACEMENT'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {plan?.totalCapacityHours ?? 3}h target today
            </span>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <PhaseBar info={phaseInfo} />
            <CFACountdown daysRemaining={cfaInfo.daysRemaining} weeksRemaining={cfaInfo.weeksRemaining} />
            {plan
              ? <TrackAllocation weights={plan.weights} allocatedHours={plan.allocatedHours} capacity={plan.totalCapacityHours} />
              : <div className="card" style={{ background: 'var(--bg-surface)' }} />
            }
          </div>

          {/* Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <HoursLogger
                logged={loggedHours}
                capacity={plan?.totalCapacityHours ?? 3}
                date={today}
                onUpdate={setLoggedHours}
              />
              {/* Track filter */}
              <div className="card" style={{ padding: 12 }}>
                <div className="terminal-label" style={{ marginBottom: 8 }}>Filter Track</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {TRACK_FILTERS.map(t => (
                    <button key={t.key} onClick={() => setActiveTrack(t.key)} style={{
                      padding: '5px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500,
                      background: activeTrack === t.key ? t.color + '20' : 'transparent',
                      border: `1px solid ${activeTrack === t.key ? t.color + '50' : 'transparent'}`,
                      color: activeTrack === t.key ? t.color : 'var(--text-muted)',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="card" style={{ padding: 20 }}>
              {plan
                ? <TaskList tasks={plan.tasks} date={today} activeTrack={activeTrack} onToggle={handleTaskToggle} />
                : <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '32px 0', textAlign: 'center' }}>Loading tasks...</div>
              }
            </div>
          </div>

          {/* Module links */}
          <div style={{ marginTop: 24 }}>
            <div className="terminal-label" style={{ marginBottom: 12 }}>Module Quick Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { href: '/finance',    label: 'Finance & CFA',     sub: 'CFA tracker · Thesis vault · DCF',  color: '#f59e0b', emoji: '📈' },
                { href: '/dataml',     label: 'Data / ML / GenAI', sub: 'SQL · Python · ML flashcards',      color: '#3b82f6', emoji: '🔷' },
                { href: '/pm',         label: 'Product Mgmt',      sub: 'Teardowns · Unit economics',        color: '#8b5cf6', emoji: '🎯' },
                { href: '/consulting', label: 'Consulting',        sub: 'Case log · Ecosystem maps',         color: '#00d4aa', emoji: '♟' },
              ].map(m => (
                <a key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 16, borderColor: m.color + '30', cursor: 'pointer' }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{m.emoji}</div>
                    <div style={{ color: m.color, fontWeight: 700, fontSize: 13 }}>{m.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 3 }}>{m.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
