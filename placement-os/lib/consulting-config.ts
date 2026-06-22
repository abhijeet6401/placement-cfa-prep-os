export const CASE_TYPES = [
  'Profitability', 'Market Entry', 'Pricing', 'M&A', 'Growth Strategy', 'Unconventional',
]

export const CASE_TYPE_COLORS: Record<string, string> = {
  'Profitability': '#00d4aa',
  'Market Entry': '#3b82f6',
  'Pricing': '#f59e0b',
  'M&A': '#f43f5e',
  'Growth Strategy': '#8b5cf6',
  'Unconventional': '#06b6d4',
}

// Four pillars of casing
export const PILLARS = [
  { key: 'g_clarify',   short: 'Clarify',   label: 'Clarifying Questions & Objective Setting' },
  { key: 'g_structure', short: 'Structure', label: 'Framework Structuring (MECE)' },
  { key: 'g_math',      short: 'Math',      label: 'Quantitative Agility' },
  { key: 'g_synth',     short: 'Synthesis', label: 'Synthesis & Recommendation' },
] as const

export const PEI_DIMENSIONS = [
  { id: 'Entrepreneurial Drive', color: '#00d4aa', hint: 'Initiative, building something from nothing, drive against odds' },
  { id: 'Inclusive Leadership', color: '#3b82f6', hint: 'Leading & motivating a team, bringing diverse people together' },
  { id: 'Personal Impact / Overcoming Conflict', color: '#f59e0b', hint: 'Persuading others, navigating conflict, driving change' },
]

export const DEFAULT_SECTORS = [
  'Smart Manufacturing',
  'Fintech / Alternative Payments',
  'Sports Tech',
  'Refurbished Goods',
]

export const SECTOR_COLORS: Record<string, string> = {
  'Smart Manufacturing': '#06b6d4',
  'Fintech / Alternative Payments': '#00d4aa',
  'Sports Tech': '#f59e0b',
  'Refurbished Goods': '#8b5cf6',
}

// Seeded India macro reference points (editable by user)
export const DEFAULT_MACRO: { label: string; value: string; unit: string; source: string }[] = [
  { label: 'India GDP (nominal)', value: '~3.9', unit: 'USD trillion', source: 'FY25 est.' },
  { label: 'India GDP growth', value: '~6.5', unit: '% YoY', source: 'FY25 est.' },
  { label: 'RBI Repo Rate', value: '6.50', unit: '%', source: 'verify current' },
  { label: 'CPI Inflation', value: '~5', unit: '% YoY', source: 'verify current' },
  { label: 'Population', value: '~1.43', unit: 'billion', source: '2024' },
  { label: 'Urban population share', value: '~36', unit: '%', source: 'approx' },
  { label: 'Avg middle-class HH income', value: '~7-10', unit: 'INR lakh/yr', source: 'approx band' },
  { label: 'Smartphone penetration', value: '~50-55', unit: '% of population', source: 'approx' },
  { label: 'Smartphone users', value: '~700', unit: 'million', source: 'approx' },
  { label: 'UPI monthly txns', value: '~14', unit: 'billion', source: 'verify current' },
  { label: 'Avg fintech CAC', value: '~₹500-1500', unit: 'per user', source: 'varies by segment' },
  { label: 'Internet users', value: '~900', unit: 'million', source: 'approx' },
]
