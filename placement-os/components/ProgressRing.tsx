'use client'

interface Props {
  logged: number
  capacity: number
  size?: number
}

export default function ProgressRing({ logged, capacity, size = 120 }: Props) {
  const pct = Math.min(1, logged / capacity)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)
  const color = pct >= 1 ? '#00d4aa' : pct >= 0.6 ? '#f59e0b' : '#3b82f6'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1e2a3a" strokeWidth={8}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ color, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
          {logged.toFixed(1)}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/ {capacity}h</span>
      </div>
    </div>
  )
}
