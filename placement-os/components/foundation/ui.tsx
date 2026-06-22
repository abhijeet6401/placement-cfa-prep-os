import React from 'react'

export const inp: React.CSSProperties = {
  width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-bright)',
  borderRadius: 4, padding: '7px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
}
export const textarea: React.CSSProperties = { ...inp, minHeight: 64, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }
export const btnPrimary: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600,
  background: '#00d4aa20', border: '1px solid #00d4aa50', color: '#00d4aa', cursor: 'pointer',
}
export const btnGhost: React.CSSProperties = {
  padding: '5px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500,
  background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--text-muted)', cursor: 'pointer',
}
export const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
}
export const modal: React.CSSProperties = {
  width: '100%', maxWidth: 620, maxHeight: '92vh', overflow: 'auto', padding: 24, borderRadius: 10,
  background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
}
export const label: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }

export function ModuleHeader({ icon, title, sub, color }: { icon: string; title: string; sub: string; color: string }) {
  return (
    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color }}>{title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
        </div>
      </div>
    </div>
  )
}
