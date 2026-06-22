import { Phase, Track, TrackWeights, ScheduledTask, DailyPlan, PhaseInfo } from './types'

// ── Timeline Constants ─────────────────────────────────────────────────────
export const PHASE_1_START = new Date('2026-06-23')
export const PHASE_1_END   = new Date('2026-08-31')
export const PHASE_2_START = new Date('2026-09-01')
export const PHASE_2_END   = new Date('2026-11-30')
export const CFA_EXAM_DATE = new Date('2027-02-27')

// ── Phase Weights ──────────────────────────────────────────────────────────
const WEIGHTS: Record<Phase, TrackWeights> = {
  phase1: { finance: 0.25, dataml: 0.35, pm: 0.15, consulting: 0.25 },
  phase2: { finance: 0.20, dataml: 0.30, pm: 0.25, consulting: 0.25 },
  post:   { finance: 0.35, dataml: 0.25, pm: 0.20, consulting: 0.20 },
}

// ── Task Bank ──────────────────────────────────────────────────────────────
const TASK_BANK: Record<Track, ScheduledTask[]> = {
  dataml: [
    { id: 'dm1', track: 'dataml', title: 'Advanced SQL: Window Functions', description: 'Practice RANK(), DENSE_RANK(), LAG/LEAD, and NTILE across real datasets.', durationHours: 1, priority: 'high', tags: ['SQL', 'Window Functions'] },
    { id: 'dm2', track: 'dataml', title: 'Advanced SQL: CTEs & Recursive Queries', description: 'Write complex CTEs and recursive queries for hierarchical data problems.', durationHours: 1, priority: 'high', tags: ['SQL', 'CTE'] },
    { id: 'dm3', track: 'dataml', title: 'Python: Pandas Data Wrangling', description: 'Clean, merge, and reshape datasets using groupby, pivot_table, and merge.', durationHours: 1, priority: 'high', tags: ['Python', 'Pandas'] },
    { id: 'dm4', track: 'dataml', title: 'ML Fundamentals: Classification Algorithms', description: 'Review Logistic Regression, Decision Trees, Random Forest — math + intuition.', durationHours: 1.5, priority: 'high', tags: ['ML', 'Classification'] },
    { id: 'dm5', track: 'dataml', title: 'A/B Testing Framework', description: 'Design a complete A/B test: hypothesis, sample size, p-value, MDE.', durationHours: 1, priority: 'high', tags: ['Stats', 'A/B Testing'] },
    { id: 'dm6', track: 'dataml', title: 'Monte Carlo Simulation', description: 'Implement a Monte Carlo simulation in Python for a business problem.', durationHours: 1, priority: 'medium', tags: ['Python', 'Simulation'] },
    { id: 'dm7', track: 'dataml', title: 'GenAI: Prompt Engineering Patterns', description: 'Study chain-of-thought, few-shot, RAG patterns. Build one small demo.', durationHours: 1, priority: 'high', tags: ['GenAI', 'LLM'] },
    { id: 'dm8', track: 'dataml', title: 'GenAI: RAG Architecture', description: 'Understand embeddings, vector stores, retrieval pipelines. Build a mini-RAG.', durationHours: 1.5, priority: 'medium', tags: ['GenAI', 'RAG'] },
    { id: 'dm9', track: 'dataml', title: 'SQL: Interview Practice Set (10 Qs)', description: 'Solve 10 medium–hard LeetCode/StrataScratch SQL problems.', durationHours: 1.5, priority: 'high', tags: ['SQL', 'Interview Prep'] },
    { id: 'dm10', track: 'dataml', title: 'Stats Flashcard Review', description: 'Review CLT, hypothesis testing, regression assumptions, multicollinearity.', durationHours: 0.5, priority: 'medium', tags: ['Stats', 'Flashcards'] },
  ],
  finance: [
    { id: 'fi1', track: 'finance', title: 'CFA: Quantitative Methods', description: 'Study time value of money, probability, hypothesis testing for CFA L1.', durationHours: 1.5, priority: 'high', tags: ['CFA', 'Quant Methods'] },
    { id: 'fi2', track: 'finance', title: 'CFA: Financial Reporting & Analysis', description: 'Income statement, balance sheet, cash flow analysis — FRA module.', durationHours: 1.5, priority: 'high', tags: ['CFA', 'FRA'] },
    { id: 'fi3', track: 'finance', title: 'CFA: Fixed Income Basics', description: 'Bond pricing, duration, yield curves, credit risk.', durationHours: 1, priority: 'medium', tags: ['CFA', 'Fixed Income'] },
    { id: 'fi4', track: 'finance', title: 'Equity Thesis Draft', description: 'Write or refine a long/short thesis on a capital goods or infrastructure company.', durationHours: 1.5, priority: 'high', tags: ['Equity Research', 'Thesis'] },
    { id: 'fi5', track: 'finance', title: 'DCF Model Review', description: 'Validate your DCF — check WACC inputs, terminal growth, sensitivity table.', durationHours: 1, priority: 'high', tags: ['Valuation', 'DCF'] },
    { id: 'fi6', track: 'finance', title: 'Macro-Regression Model Audit', description: 'Check coefficient logic in macro models. Remove spurious correlations.', durationHours: 1, priority: 'medium', tags: ['Quant', 'Regression'] },
    { id: 'fi7', track: 'finance', title: 'Quant Signal Backtest Log', description: 'Run and log backtest results. Record Sharpe, Fitness, and improvement delta.', durationHours: 1, priority: 'medium', tags: ['Quant', 'Backtesting'] },
    { id: 'fi8', track: 'finance', title: 'CFA Practice Questions (30 Qs)', description: 'Complete a timed 30-question CFA practice set. Log weak areas.', durationHours: 1, priority: 'high', tags: ['CFA', 'Practice'] },
  ],
  consulting: [
    { id: 'co1', track: 'consulting', title: 'Case Practice: Market Entry', description: 'Work through a Market Entry case with a partner or solo. Log framework used.', durationHours: 1, priority: 'high', tags: ['Case', 'Market Entry'] },
    { id: 'co2', track: 'consulting', title: 'Case Practice: Profitability', description: 'Profitability case — identify revenue vs. cost drivers. Time your math.', durationHours: 1, priority: 'high', tags: ['Case', 'Profitability'] },
    { id: 'co3', track: 'consulting', title: 'Case Practice: Pricing Strategy', description: 'Pricing case — value-based vs. cost-plus. Quantify the recommendation.', durationHours: 1, priority: 'medium', tags: ['Case', 'Pricing'] },
    { id: 'co4', track: 'consulting', title: 'Ecosystem Map: Smart Manufacturing', description: 'Map white space opportunities in Industry 4.0 / smart manufacturing sector.', durationHours: 1, priority: 'medium', tags: ['Ecosystem', 'Manufacturing'] },
    { id: 'co5', track: 'consulting', title: 'Ecosystem Map: Sports Tech', description: 'Benchmark players, gaps, and monetization models in the sports tech space.', durationHours: 1, priority: 'medium', tags: ['Ecosystem', 'Sports Tech'] },
    { id: 'co6', track: 'consulting', title: 'Ecosystem Map: Refurbished Goods', description: 'Analyze the refurbished electronics/goods sector — unit economics, key players.', durationHours: 1, priority: 'low', tags: ['Ecosystem', 'Refurb'] },
    { id: 'co7', track: 'consulting', title: 'Case Math Drills (15 mins)', description: 'Fast mental math — percentages, CAGR, market sizing. Log accuracy.', durationHours: 0.5, priority: 'high', tags: ['Case', 'Math'] },
    { id: 'co8', track: 'consulting', title: 'Structuring Practice: MECE Frameworks', description: 'Write 3 MECE issue trees for different industries from scratch.', durationHours: 0.5, priority: 'medium', tags: ['Frameworks', 'Structuring'] },
  ],
  pm: [
    { id: 'pm1', track: 'pm', title: 'Product Teardown: CIRCLES Method', description: 'Tear down a product using the CIRCLES framework. Log in structured form.', durationHours: 1, priority: 'high', tags: ['PM', 'CIRCLES', 'Teardown'] },
    { id: 'pm2', track: 'pm', title: 'Product Teardown: AARM Method', description: 'Apply AARM (Acquisition, Activation, Retention, Monetization) to a product.', durationHours: 1, priority: 'medium', tags: ['PM', 'AARM', 'Teardown'] },
    { id: 'pm3', track: 'pm', title: 'Unit Economics: CAC & LTV', description: 'Calculate CAC, LTV, LTV:CAC ratio for a fintech product. Sanity-check inputs.', durationHours: 0.5, priority: 'high', tags: ['PM', 'Unit Economics'] },
    { id: 'pm4', track: 'pm', title: 'SNBL Model Deep Dive', description: 'Analyze Save Now, Buy Later unit economics — merchant incentives, margin leakage.', durationHours: 1, priority: 'high', tags: ['PM', 'Fintech', 'SNBL'] },
    { id: 'pm5', track: 'pm', title: 'APM Interview: Product Sense Q&A', description: 'Practice 3 product sense questions. Use structured design framework each time.', durationHours: 1, priority: 'high', tags: ['PM', 'Interview'] },
    { id: 'pm6', track: 'pm', title: 'Metrics Deep Dive: Define Success', description: 'For a product, define the North Star metric and guardrail metrics hierarchy.', durationHours: 0.5, priority: 'medium', tags: ['PM', 'Metrics'] },
  ],
  foundation: [
    { id: 'fo1', track: 'foundation', title: 'Aptitude: Probability Problems (5 Qs)', description: 'Solve 5 probability problems from standard placement sets.', durationHours: 0.5, priority: 'high', tags: ['Aptitude', 'Probability'] },
    { id: 'fo2', track: 'foundation', title: 'Logic Puzzle Set', description: 'Complete one timed logic/reasoning puzzle set.', durationHours: 0.5, priority: 'medium', tags: ['Aptitude', 'Logic'] },
    { id: 'fo3', track: 'foundation', title: 'Company Research: Day 1 Targets', description: 'Research 2 Day 1 companies — role, culture, past interview questions.', durationHours: 0.5, priority: 'high', tags: ['Placement', 'Research'] },
    { id: 'fo4', track: 'foundation', title: 'Resume Bullet Defense Practice', description: 'Pick 3 resume bullets. Write expected Qs, methodology, and quantified impact.', durationHours: 0.5, priority: 'high', tags: ['Resume', 'Interview Prep'] },
  ],
}

// ── Core Scheduling Logic ──────────────────────────────────────────────────
export function getPhase(date: Date): Phase {
  if (date >= PHASE_1_START && date <= PHASE_1_END) return 'phase1'
  if (date >= PHASE_2_START && date <= PHASE_2_END) return 'phase2'
  return 'post'
}

export function getDailyCapacity(date: Date, phase: Phase): number {
  const day = date.getDay()
  if (phase === 'phase1') {
    if (day === 0) return 6   // Sunday
    if (day === 6) return 4   // Saturday (light)
    return 3                  // Weekday
  }
  // Phase 2 & post: 6–8 hrs, use 7 as default
  return day === 6 || day === 0 ? 8 : 7
}

export function getPhaseInfo(date: Date): PhaseInfo {
  const phase = getPhase(date)
  const msPerDay = 86400000

  if (phase === 'phase1') {
    const total = Math.round((PHASE_1_END.getTime() - PHASE_1_START.getTime()) / msPerDay)
    const elapsed = Math.round((date.getTime() - PHASE_1_START.getTime()) / msPerDay)
    return {
      phase,
      label: 'Phase 1 — Hard Skills',
      description: '3 hrs/day · Front-loading SQL, Python, ML & CFA Quant',
      startDate: PHASE_1_START.toISOString(),
      endDate: PHASE_1_END.toISOString(),
      daysRemaining: Math.max(0, total - elapsed),
      daysElapsed: elapsed,
      totalDays: total,
      progressPercent: Math.min(100, Math.round((elapsed / total) * 100)),
    }
  }

  if (phase === 'phase2') {
    const total = Math.round((PHASE_2_END.getTime() - PHASE_2_START.getTime()) / msPerDay)
    const elapsed = Math.round((date.getTime() - PHASE_2_START.getTime()) / msPerDay)
    return {
      phase,
      label: 'Phase 2 — Placement Sprint',
      description: '6-8 hrs/day · Applications, Mocks, Case Studies',
      startDate: PHASE_2_START.toISOString(),
      endDate: PHASE_2_END.toISOString(),
      daysRemaining: Math.max(0, total - elapsed),
      daysElapsed: elapsed,
      totalDays: total,
      progressPercent: Math.min(100, Math.round((elapsed / total) * 100)),
    }
  }

  return {
    phase: 'post',
    label: 'Post-Placement · CFA Sprint',
    description: 'Full focus on CFA Level 1 prep',
    startDate: PHASE_2_END.toISOString(),
    endDate: CFA_EXAM_DATE.toISOString(),
    daysRemaining: Math.max(0, Math.round((CFA_EXAM_DATE.getTime() - date.getTime()) / msPerDay)),
    daysElapsed: 0,
    totalDays: 89,
    progressPercent: 0,
  }
}

export function getCFACountdown(date: Date) {
  const msRemaining = CFA_EXAM_DATE.getTime() - date.getTime()
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / 86400000))
  return {
    daysRemaining,
    weeksRemaining: Math.floor(daysRemaining / 7),
    examDate: CFA_EXAM_DATE.toISOString(),
  }
}

export function generateDailyPlan(date: Date, completedTaskIds: string[] = []): DailyPlan {
  const phase = getPhase(date)
  const capacity = getDailyCapacity(date, phase)
  const weights = WEIGHTS[phase]

  // Allocate hours per track
  const allocatedHours: Record<Track, number> = {
    finance: Math.round(capacity * weights.finance * 10) / 10,
    dataml:  Math.round(capacity * weights.dataml  * 10) / 10,
    pm:      Math.round(capacity * weights.pm      * 10) / 10,
    consulting: Math.round(capacity * weights.consulting * 10) / 10,
    foundation: 0.5, // always include a foundation block
  }

  const tracks: Track[] = ['dataml', 'finance', 'consulting', 'pm', 'foundation']
  const tasks: ScheduledTask[] = []

  for (const track of tracks) {
    const budget = track === 'foundation' ? 0.5 : allocatedHours[track]
    const available = TASK_BANK[track].filter(t => !completedTaskIds.includes(t.id))
    let remaining = budget

    for (const task of available) {
      if (remaining <= 0) break
      if (task.durationHours <= remaining + 0.25) { // small tolerance
        tasks.push({ ...task, completed: completedTaskIds.includes(task.id) })
        remaining -= task.durationHours
      }
    }
  }

  return {
    date: date.toISOString().split('T')[0],
    phase,
    totalCapacityHours: capacity,
    weights,
    tasks,
    allocatedHours,
  }
}
