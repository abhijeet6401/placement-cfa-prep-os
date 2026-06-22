import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'placement-os.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      logged_hours REAL DEFAULT 0,
      track_breakdown TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS completed_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      task_id TEXT NOT NULL,
      track TEXT NOT NULL,
      UNIQUE(date, task_id)
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tier TEXT NOT NULL CHECK(tier IN ('day1','day2','day3')),
      track TEXT NOT NULL,
      status TEXT DEFAULT 'target',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ── Finance & CFA module ───────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS cfa_progress (
      reading_id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      status TEXT DEFAULT 'not_started',  -- not_started | reading | practiced | mastered
      confidence INTEGER DEFAULT 0,        -- 0-5
      last_reviewed TEXT,
      notes TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS theses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT DEFAULT '',
      company TEXT NOT NULL,
      sector TEXT DEFAULT '',
      direction TEXT DEFAULT 'long',       -- long | short
      conviction INTEGER DEFAULT 3,        -- 1-5
      target_price REAL,
      current_price REAL,
      time_horizon TEXT DEFAULT '',
      catalyst TEXT DEFAULT '',
      thesis TEXT DEFAULT '',
      risks TEXT DEFAULT '',
      status TEXT DEFAULT 'draft',         -- draft | refined | pitch_ready
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dcf_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      model_type TEXT DEFAULT 'dcf',       -- dcf | macro_regression | other
      link TEXT DEFAULT '',
      wacc REAL,
      terminal_growth REAL,
      implied_value REAL,
      checklist TEXT DEFAULT '{}',         -- JSON of validation checks
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quant_signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      strategy_name TEXT NOT NULL,
      run_date TEXT NOT NULL,
      sharpe REAL,
      fitness REAL,
      returns REAL,
      max_drawdown REAL,
      universe TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ── Product Management module ──────────────────────────────────────
    -- Generic entry store across all 7 interview rounds.
    -- round: product_sense | design | rca | analytics | teardown | architecture | vibe_coding
    -- data: JSON payload whose shape is defined per-round in lib/pm-config.ts
    -- confidence: 1=Needs Practice, 2=Developing, 3=Solid, 4=Interview Ready
    CREATE TABLE IF NOT EXISTS pm_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      round TEXT NOT NULL,
      title TEXT NOT NULL,
      data TEXT DEFAULT '{}',
      confidence INTEGER DEFAULT 1,
      feedback TEXT DEFAULT '',
      feedback_tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- ── Consulting & Strategy module ───────────────────────────────────
    CREATE TABLE IF NOT EXISTS consulting_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_date TEXT NOT NULL,
      title TEXT DEFAULT '',
      case_type TEXT DEFAULT 'Profitability',
      partner TEXT DEFAULT '',
      g_clarify INTEGER DEFAULT 0,    -- 1-5: clarifying questions & objective setting
      g_structure INTEGER DEFAULT 0,  -- 1-5: framework structuring (MECE)
      g_math INTEGER DEFAULT 0,       -- 1-5: quantitative agility
      g_synth INTEGER DEFAULT 0,      -- 1-5: synthesis & recommendation
      partner_feedback TEXT DEFAULT '',
      self_reflection TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS guesstimates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      approach TEXT DEFAULT 'bottom_up',   -- bottom_up | top_down_proxy
      assumption_tree TEXT DEFAULT '[]',   -- JSON list of assumption steps
      data_cuts TEXT DEFAULT '[]',         -- JSON list of segmentation dimensions
      estimate REAL,
      actual REAL,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sector_playbook (
      sector TEXT PRIMARY KEY,
      value_chain TEXT DEFAULT '{}',       -- JSON {suppliers,manufacturers,distributors,consumers}
      players TEXT DEFAULT '[]',           -- JSON [{name,moat,whitespace}]
      notes TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pei_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dimension TEXT DEFAULT 'Entrepreneurial Drive',
      title TEXT DEFAULT '',
      situation TEXT DEFAULT '',
      task TEXT DEFAULT '',
      action TEXT DEFAULT '',
      result TEXT DEFAULT '',
      impact TEXT DEFAULT '',               -- mandated hard number / outcome
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS macro_refs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT DEFAULT '',
      unit TEXT DEFAULT '',
      source TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS consulting_settings (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT ''
    );

    -- ── Data / ML / GenAI module ───────────────────────────────────────
    CREATE TABLE IF NOT EXISTS ml_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,         -- DSA | SQL | Core ML | GenAI/LLM | Quant/Stats
      topic TEXT NOT NULL,
      proficiency TEXT DEFAULT 'Beginner', -- Beginner | Intermediate | Advanced
      last_reviewed TEXT DEFAULT '',
      next_action TEXT DEFAULT '',
      sort INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ml_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      problem TEXT DEFAULT '',
      tech_stack TEXT DEFAULT '[]',   -- JSON list of tags
      metrics_impact TEXT DEFAULT '',
      link TEXT DEFAULT '',
      status TEXT DEFAULT 'idea',     -- idea | building | shipped | cv_ready
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ml_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role_focus TEXT DEFAULT 'Data Analyst', -- Quant | Core ML | Data Analyst | Product | GenAI
      target_day TEXT DEFAULT 'Day 1',
      status TEXT DEFAULT 'cv_verification',
      requirements TEXT DEFAULT '',
      sort INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ml_research (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      ai_initiatives TEXT DEFAULT '',
      tech_stack TEXT DEFAULT '',
      prev_questions TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- ── Core Foundation (global) ───────────────────────────────────────
    -- Company Tiering reuses the pre-existing companies table (tier day1/day2/day3).
    CREATE TABLE IF NOT EXISTS resume_bullets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT DEFAULT 'Experience',   -- Experience | Projects | POR | Achievements
      bullet TEXT NOT NULL,
      follow_up_questions TEXT DEFAULT '', -- expected interview probes
      methodology TEXT DEFAULT '',         -- how you actually did it
      quantified_impact TEXT DEFAULT '',   -- the hard number
      track TEXT DEFAULT 'all',            -- finance | dataml | pm | consulting | all
      strength INTEGER DEFAULT 1,          -- 1=Shaky, 2=Okay, 3=Bulletproof
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS aptitude_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      log_date TEXT NOT NULL,
      category TEXT NOT NULL,              -- Probability | Statistics | Logic Puzzles | Quant Aptitude | Data Interpretation
      count INTEGER DEFAULT 0,             -- problems attempted
      correct INTEGER DEFAULT 0,           -- problems correct
      minutes INTEGER DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `)
}
