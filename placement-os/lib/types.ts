export type Phase = 'phase1' | 'phase2' | 'post'
export type Track = 'finance' | 'dataml' | 'pm' | 'consulting' | 'foundation'

export interface TrackWeights {
  finance: number
  dataml: number
  pm: number
  consulting: number
}

export interface ScheduledTask {
  id: string
  track: Track
  title: string
  description: string
  durationHours: number
  priority: 'high' | 'medium' | 'low'
  tags: string[]
  completed?: boolean
}

export interface DailyPlan {
  date: string
  phase: Phase
  totalCapacityHours: number
  weights: TrackWeights
  tasks: ScheduledTask[]
  allocatedHours: Record<Track, number>
}

export interface HoursLog {
  id?: number
  date: string
  loggedHours: number
  trackBreakdown: string // JSON
}

export interface PhaseInfo {
  phase: Phase
  label: string
  description: string
  startDate: string
  endDate: string
  daysRemaining: number
  daysElapsed: number
  totalDays: number
  progressPercent: number
}
