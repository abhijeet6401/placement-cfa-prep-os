// Data / ML / GenAI module config

export const SKILL_CATEGORIES = [
  { id: 'DSA',        label: 'DSA',                     color: '#3b82f6' },
  { id: 'SQL',        label: 'Advanced SQL',            color: '#00d4aa' },
  { id: 'Core ML',    label: 'Core ML Algorithms',      color: '#f59e0b' },
  { id: 'GenAI/LLM',  label: 'GenAI / LLM Architectures', color: '#8b5cf6' },
  { id: 'Quant/Stats', label: 'Quant / Statistical Modeling', color: '#f43f5e' },
]

export const PROFICIENCY = [
  { id: 'Beginner',     color: '#f43f5e', pct: 33 },
  { id: 'Intermediate', color: '#f59e0b', pct: 66 },
  { id: 'Advanced',     color: '#00d4aa', pct: 100 },
]

// Application pipeline stages (CDC phases)
export const PIPELINE_STAGES = [
  { id: 'cv_verification', label: 'CV Verification', color: '#64748b' },
  { id: 'oa_scheduled',    label: 'OA Scheduled',    color: '#3b82f6' },
  { id: 'oa_completed',    label: 'OA Completed',     color: '#06b6d4' },
  { id: 'shortlisted',     label: 'Shortlisted',      color: '#8b5cf6' },
  { id: 'interviewing',    label: 'Interviewing',     color: '#f59e0b' },
  { id: 'offer',           label: 'Offer',            color: '#00d4aa' },
]

export const ROLE_FOCUS = ['Quant', 'Core ML', 'Data Analyst', 'Product', 'GenAI', 'Data Engineer']
export const TARGET_DAYS = ['Day 1', 'Day 2', 'Day 3', 'Off-campus']

export const PROJECT_STATUS = [
  { id: 'idea',     label: 'Idea',     color: '#64748b' },
  { id: 'building', label: 'Building',  color: '#f59e0b' },
  { id: 'shipped',  label: 'Shipped',   color: '#3b82f6' },
  { id: 'cv_ready', label: 'CV-Ready',  color: '#00d4aa' },
]

export const TECH_TAGS = ['Python', 'SQL', 'Pandas', 'scikit-learn', 'PyTorch', 'TensorFlow', 'Streamlit', 'Metabase', 'Looker Studio', 'Tableau', 'LangChain', 'OpenAI', 'Hugging Face', 'pgAdmin', 'PostgreSQL', 'Spark', 'dbt', 'FastAPI']

// Seed skills covering the core competencies from the spec
export const SEED_SKILLS: { category: string; topic: string }[] = [
  { category: 'DSA', topic: 'Arrays & Hashing' },
  { category: 'DSA', topic: 'Trees & Graphs (BFS/DFS)' },
  { category: 'DSA', topic: 'Dynamic Programming' },
  { category: 'SQL', topic: 'Window Functions' },
  { category: 'SQL', topic: 'CTEs & Recursive Queries' },
  { category: 'SQL', topic: 'Query Optimization & EXPLAIN (pgAdmin)' },
  { category: 'Core ML', topic: 'Linear & Logistic Regression' },
  { category: 'Core ML', topic: 'Tree Ensembles (RF, XGBoost)' },
  { category: 'Core ML', topic: 'Bias-Variance & Regularization' },
  { category: 'GenAI/LLM', topic: 'Transformer Architecture & Attention' },
  { category: 'GenAI/LLM', topic: 'RAG & Vector Embeddings' },
  { category: 'GenAI/LLM', topic: 'Fine-tuning vs Prompting' },
  { category: 'Quant/Stats', topic: 'Hypothesis Testing & A/B Tests' },
  { category: 'Quant/Stats', topic: 'Probability Distributions' },
  { category: 'Quant/Stats', topic: 'Bayesian Inference' },
]
