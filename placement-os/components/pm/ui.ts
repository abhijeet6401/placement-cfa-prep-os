import React from 'react'

export const inp: React.CSSProperties = {
  width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-bright)',
  borderRadius: 4, padding: '7px 10px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
}
export const textarea: React.CSSProperties = { ...inp, minHeight: 70, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }
export const btnPrimary: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600,
  background: '#8b5cf620', border: '1px solid #8b5cf650', color: '#a78bfa', cursor: 'pointer',
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
  width: '100%', maxWidth: 680, maxHeight: '92vh', overflow: 'auto', padding: 24, borderRadius: 10,
  background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
}
