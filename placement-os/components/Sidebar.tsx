'use client'

import { getCFACountdown } from '@/lib/scheduler'

const NAV = [
  { href: '/',           label: 'Dashboard',      icon: '⬛' },
  { href: '/finance',    label: 'Finance & CFA',  icon: '📈' },
  { href: '/dataml',     label: 'Data / ML / AI', icon: '🔷' },
  { href: '/pm',         label: 'Product Mgmt',   icon: '🎯' },
  { href: '/consulting', label: 'Consulting',     icon: '♟' },
  { href: '/companies',  label: 'Company Matrix', icon: '🏢' },
  { href: '/resume',     label: 'Resume Defense', icon: '📄' },
  { href: '/aptitude',   label: 'Aptitude & Puzzles', icon: '🧩' },
]

export default function Sidebar({ active }: { active: string }) {
  const cfa = getCFACountdown(new Date())
  return (
    <div style={{
      width: 220, flexShrink: 0, background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)', padding: '20px 0',
      display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#00d4aa', letterSpacing: '0.06em' }}>PREP OS</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Placement & CFA Dashboard</div>
      </div>
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {NAV.map(item => {
          const isActive = item.href === active
          return (
            <a key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 12px', borderRadius: 6, marginBottom: 2,
              fontSize: 12, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              textDecoration: 'none',
            }}>
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              {item.label}
            </a>
          )
        })}
      </nav>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>CFA L1 Exam</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#00d4aa', lineHeight: 1 }}>{cfa.daysRemaining}d</div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>Feb 27, 2027</div>
      </div>
    </div>
  )
}
