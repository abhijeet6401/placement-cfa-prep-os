'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import CFATracker from '@/components/finance/CFATracker'
import ThesisVault from '@/components/finance/ThesisVault'
import ModelDefenseLog from '@/components/finance/ModelDefenseLog'
import QuantSignalTracker from '@/components/finance/QuantSignalTracker'

const TABS = [
  { id: 'cfa',    label: 'CFA L1 Tracker',     icon: '📚', sub: 'Checklist across all 10 topics' },
  { id: 'thesis', label: 'Pitch & Thesis Vault', icon: '💡', sub: 'Long/short equity ideas' },
  { id: 'model',  label: 'Model Defense Log',   icon: '🧮', sub: 'DCF & macro validity checks' },
  { id: 'quant',  label: 'Quant Signal Tracker', icon: '📡', sub: 'Backtest Sharpe & Fitness' },
] as const

type TabId = typeof TABS[number]['id']

export default function FinancePage() {
  const [tab, setTab] = useState<TabId>('cfa')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="/finance" />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📈</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#f59e0b' }}>Finance & Quant Track</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CFA L1 · Equity research · Valuation · Quant signals</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Tab bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {TABS.map(t => {
              const active = tab === t.id
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '12px 14px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                  background: active ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: `1px solid ${active ? '#f59e0b50' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: active ? '#f59e0b' : 'var(--text-primary)' }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{t.sub}</div>
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          {tab === 'cfa'    && <CFATracker />}
          {tab === 'thesis' && <ThesisVault />}
          {tab === 'model'  && <ModelDefenseLog />}
          {tab === 'quant'  && <QuantSignalTracker />}
        </div>
      </div>
    </div>
  )
}
