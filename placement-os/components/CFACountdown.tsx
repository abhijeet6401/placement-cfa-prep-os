'use client'

interface Props {
  daysRemaining: number
  weeksRemaining: number
}

export default function CFACountdown({ daysRemaining, weeksRemaining }: Props) {
  const urgency = daysRemaining < 60 ? '#f43f5e' : daysRemaining < 120 ? '#f59e0b' : '#00d4aa'
  return (
    <div className="card p-4" style={{ borderColor: urgency + '40' }}>
      <div className="terminal-label mb-2">CFA Level 1 · Feb 27, 2027</div>
      <div className="flex items-end gap-3">
        <div>
          <div style={{ color: urgency, fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
            {daysRemaining}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>days remaining</div>
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: 12, paddingBottom: 2 }}>
          ≈ {weeksRemaining} weeks
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
        {daysRemaining > 120 ? '🟢 On track — build foundations' :
         daysRemaining > 60  ? '🟡 Ramp up practice questions' :
                               '🔴 Final sprint mode'}
      </div>
    </div>
  )
}
