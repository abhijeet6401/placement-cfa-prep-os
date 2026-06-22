// Core Foundation module config

export const TIERS = [
  { id: 'day1', label: 'Day 1', color: '#00d4aa', desc: 'Dream / top-tier — highest prep priority' },
  { id: 'day2', label: 'Day 2', color: '#3b82f6', desc: 'Strong targets' },
  { id: 'day3', label: 'Day 3', color: '#f59e0b', desc: 'Safe / backup options' },
]

// Track tags shared across the app
export const TRACKS = [
  { id: 'all',        label: 'All / General', color: '#64748b' },
  { id: 'finance',    label: 'Finance',       color: '#f59e0b' },
  { id: 'dataml',     label: 'Data / ML',     color: '#3b82f6' },
  { id: 'pm',         label: 'Product',       color: '#8b5cf6' },
  { id: 'consulting', label: 'Consulting',    color: '#00d4aa' },
]

export const COMPANY_STATUS = [
  { id: 'target',     label: 'Target',     color: '#64748b' },
  { id: 'applied',    label: 'Applied',    color: '#3b82f6' },
  { id: 'in_process', label: 'In Process', color: '#f59e0b' },
  { id: 'offer',      label: 'Offer',      color: '#00d4aa' },
  { id: 'rejected',   label: 'Closed',     color: '#f43f5e' },
]

export const RESUME_SECTIONS = ['Experience', 'Projects', 'POR', 'Achievements']

export const RESUME_STRENGTH = [
  { v: 1, label: 'Shaky',       color: '#f43f5e' },
  { v: 2, label: 'Okay',        color: '#f59e0b' },
  { v: 3, label: 'Bulletproof', color: '#00d4aa' },
]

export const APTITUDE_CATEGORIES = [
  { id: 'Probability',         color: '#3b82f6' },
  { id: 'Statistics',          color: '#00d4aa' },
  { id: 'Logic Puzzles',       color: '#8b5cf6' },
  { id: 'Quant Aptitude',      color: '#f59e0b' },
  { id: 'Data Interpretation', color: '#f43f5e' },
]
