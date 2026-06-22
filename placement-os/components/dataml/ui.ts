import React from 'react'

export const ACCENT = '#3b82f6'

export const inp: React.CSSProperties = {
  width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-bright)',
  borderRadius: 4, padding: '7px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
}
export const textarea: React.CSSProperties = { ...inp, minHeight: 64, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }
export const btnPrimary: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600,
  background: ACCENT + '20', border: `1px solid ${ACCENT}50`, color: '#60a5fa', cursor: 'pointer',
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
