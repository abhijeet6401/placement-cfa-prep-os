// Product Management module — config-driven round definitions.
// Each round declares tailored fields; the generic EntryForm renders them and
// special widgets (rice, unit_econ, rca_tree, metric_pair, timer) handle computation.

export type FieldType =
  | 'text' | 'textarea' | 'number' | 'select' | 'tags' | 'list'
  | 'rice' | 'unit_econ' | 'rca_tree' | 'metric_pair' | 'timer' | 'kv_list'

export interface Field {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: string[]
  hint?: string
}

export interface RoundConfig {
  id: string
  name: string
  short: string
  icon: string
  color: string
  objective: string
  audience: string // who asks this round (APM/TPM/both)
  fields: Field[]
}

// ── Failure-mode tags for AI / peer feedback ──────────────────────────
export const FAILURE_TAGS = [
  'Poor structure',
  'Weak metrics',
  'Too tech-heavy',
  'Not customer-centric',
  'Shallow prioritization',
  'Missed edge cases',
  'No clear recommendation',
  'Rambling / time mgmt',
  'Weak market sizing',
  'Ignored trade-offs',
  'Strong — keep doing',
]

export const CONFIDENCE_LEVELS = [
  { v: 1, label: 'Needs Practice', color: '#f43f5e' },
  { v: 2, label: 'Developing',     color: '#f59e0b' },
  { v: 3, label: 'Solid',          color: '#3b82f6' },
  { v: 4, label: 'Interview Ready', color: '#00d4aa' },
]

export const PM_ROUNDS: RoundConfig[] = [
  {
    id: 'product_sense',
    name: 'Product Sense & Strategy',
    short: 'Sense',
    icon: '🧭',
    color: '#8b5cf6',
    objective: 'Strategic alignment, market entry, and vision.',
    audience: 'APM',
    fields: [
      { key: 'prompt', label: 'Interview Prompt', type: 'text', placeholder: 'e.g. Design a payments product for rural India' },
      { key: 'mission', label: 'Company Mission', type: 'textarea', placeholder: 'What is the company trying to achieve? How does this fit?' },
      // CIRCLES scaffold
      { key: 'circles_comprehend', label: 'CIRCLES · Comprehend Situation', type: 'textarea', placeholder: 'Context, scope, who is the customer, what is the goal' },
      { key: 'circles_customer', label: 'CIRCLES · Identify Customer (Persona Discovery)', type: 'textarea', placeholder: 'Personas, segments, JTBD' },
      { key: 'circles_needs', label: 'CIRCLES · Report Needs', type: 'list', placeholder: 'A user need...' },
      // 3Ts
      { key: 't_target', label: '3T · Target', type: 'text', placeholder: 'Who exactly are we serving first?' },
      { key: 't_technology', label: '3T · Technology', type: 'text', placeholder: 'What capability/tech unlocks this?' },
      { key: 't_timing', label: '3T · Timing', type: 'text', placeholder: 'Why now? Market/regulatory tailwind' },
      { key: 'ecosystem', label: 'Ecosystem Assessment', type: 'textarea', placeholder: 'Players, value chain, white space' },
      { key: 'prioritization', label: 'Prioritization Matrix (RICE)', type: 'rice' },
      { key: 'recommendation', label: 'Recommendation & Vision', type: 'textarea' },
    ],
  },
  {
    id: 'design',
    name: 'Product Design & Innovation',
    short: 'Design',
    icon: '🎨',
    color: '#ec4899',
    objective: 'User-centric design for new or transformed products.',
    audience: 'APM',
    fields: [
      { key: 'challenge', label: 'Design Challenge', type: 'text', placeholder: 'e.g. Design a savings app for Tier-2 kirana merchants' },
      { key: 'constraint_cohort', label: 'Target Demographic Constraint', type: 'select',
        options: ['None', 'Tier-2/Tier-3 merchants', 'Non-tech-savvy cohort', 'Low-bandwidth / feature phone', 'Gen-Z first-time users', 'Elderly users', 'Custom'] },
      { key: 'pain_points', label: 'User Pain Points', type: 'list', placeholder: 'A specific pain point...' },
      { key: 'superpowers', label: 'Superpowers / Delighters', type: 'list', placeholder: 'A delighter that creates love...' },
      { key: 'solutions', label: 'Solution Concepts', type: 'list', placeholder: 'A solution idea...' },
      { key: 'mvp_scope', label: 'MVP Scope Definition', type: 'textarea', placeholder: 'What is in v1? What is explicitly out?' },
      { key: 'success_metric', label: 'How will you measure success?', type: 'text' },
    ],
  },
  {
    id: 'rca',
    name: 'Root Cause Analysis',
    short: 'RCA',
    icon: '🔍',
    color: '#f59e0b',
    objective: 'Systematically diagnose sudden or gradual metric drops.',
    audience: 'Both',
    fields: [
      { key: 'metric', label: 'Affected Metric', type: 'text', placeholder: 'e.g. DAU dropped 15% WoW' },
      { key: 'drop_type', label: 'Drop Type', type: 'select', options: ['Sudden (spike)', 'Gradual (trend)'] },
      { key: 'tree', label: 'RCA Diagnostic Tree', type: 'rca_tree' },
      { key: 'recommendation', label: 'Recommendation & Fix', type: 'textarea', placeholder: 'Root cause hypothesis + concrete fix' },
    ],
  },
  {
    id: 'analytics',
    name: 'Product Analytics & Metrics',
    short: 'Metrics',
    icon: '📊',
    color: '#3b82f6',
    objective: 'Define success metrics and debug growth funnels.',
    audience: 'Both',
    fields: [
      { key: 'feature', label: 'Feature / Product', type: 'text', placeholder: 'e.g. Save Now, Buy Later checkout' },
      { key: 'metrics', label: 'North Star & Guardrail Metrics', type: 'metric_pair' },
      { key: 'funnel', label: 'Funnel Stages (debug)', type: 'list', placeholder: 'Stage → metric → drop-off hypothesis' },
      { key: 'unit_econ', label: 'Unit Economics Simulator', type: 'unit_econ' },
      { key: 'notes', label: 'Analysis Notes', type: 'textarea' },
    ],
  },
  {
    id: 'teardown',
    name: 'Product Improvement & Teardowns',
    short: 'Teardown',
    icon: '🔧',
    color: '#00d4aa',
    objective: 'Critique existing products and propose optimization roadmaps.',
    audience: 'APM',
    fields: [
      { key: 'product', label: 'Product Under Review', type: 'text' },
      { key: 'sector', label: 'Industry Sector', type: 'select',
        options: ['Fintech / Alternative Payments', 'Smart Manufacturing', 'Refurbished Goods', 'Sports Tech', 'Other'] },
      { key: 'ux_friction', label: 'Current UX Friction Points', type: 'list', placeholder: 'A friction point...' },
      { key: 'adoption_barriers', label: 'Feature Adoption Barriers', type: 'list', placeholder: 'An adoption barrier...' },
      { key: 'plan_30', label: '30-Day Plan', type: 'textarea', placeholder: 'Quick wins, instrumentation' },
      { key: 'plan_60', label: '60-Day Plan', type: 'textarea', placeholder: 'Core improvements, experiments' },
      { key: 'plan_90', label: '90-Day Plan', type: 'textarea', placeholder: 'Scaled rollout, north-star impact' },
    ],
  },
  {
    id: 'architecture',
    name: 'Product Builder & Architecture',
    short: 'Architecture',
    icon: '🏗️',
    color: '#06b6d4',
    objective: 'Bridge product requirements and system engineering. (TPM)',
    audience: 'TPM',
    fields: [
      { key: 'system', label: 'System / Feature', type: 'text', placeholder: 'e.g. Real-time fraud scoring pipeline' },
      { key: 'requirements', label: 'Product Requirements', type: 'list', placeholder: 'A functional/non-functional requirement...' },
      { key: 'api_deps', label: 'System Constraints · API Dependencies', type: 'list', placeholder: 'An API/service dependency...' },
      { key: 'db_choice', label: 'System Constraints · Database', type: 'select', options: ['SQL (relational)', 'NoSQL (document)', 'NoSQL (key-value)', 'Time-series', 'Hybrid', 'Undecided'] },
      { key: 'db_rationale', label: 'Database Rationale (SQL vs NoSQL)', type: 'textarea' },
      { key: 'latency', label: 'Latency / Throughput Requirements', type: 'text', placeholder: 'e.g. p99 < 200ms, 10k TPS' },
      { key: 'tradeoffs', label: 'Technical Trade-off Log', type: 'kv_list', hint: 'Decision → product impact (e.g. WebSockets vs batch)' },
    ],
  },
  {
    id: 'vibe_coding',
    name: 'Vibe Coding & Rapid Prototyping',
    short: 'Vibe Coding',
    icon: '⚡',
    color: '#eab308',
    objective: 'Fast AI-assisted prototyping, low-code, quick logic proofing.',
    audience: 'TPM',
    fields: [
      { key: 'goal', label: 'Prototype Goal', type: 'text', placeholder: 'e.g. Streamlit dashboard for cohort retention' },
      { key: 'stack', label: 'Stack / Tooling', type: 'select', options: ['Streamlit', 'Python script', 'Next.js / React', 'v0 / Lovable', 'Figma mockup', 'Claude/GPT-generated', 'Other'] },
      { key: 'timer', label: 'Time-to-Prototype', type: 'timer' },
      { key: 'iterations', label: 'Build Iterations Log', type: 'list', placeholder: 'Iteration: what changed, what broke...' },
      { key: 'learnings', label: 'Learnings', type: 'textarea' },
    ],
  },
]

export function getRound(id: string): RoundConfig | undefined {
  return PM_ROUNDS.find(r => r.id === id)
}
