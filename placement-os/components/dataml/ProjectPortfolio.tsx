'use client'

import { useEffect, useState } from 'react'
import { PROJECT_STATUS, TECH_TAGS } from '@/lib/dataml-config'
import { inp, textarea, btnPrimary, btnGhost, overlay, modal, label } from './ui'

interface Project {
  id: number; title: string; problem: string; tech_stack: string[];
  metrics_impact: string; link: string; status: string
}
interface Raw extends Omit<Project, 'tech_stack'> { tech_stack: string }
function parse(r: Raw): Project { return { ...r, tech_stack: safe(r.tech_stack) } }
function safe(s: string): string[] { try { return JSON.parse(s) } catch { return [] } }
function empty(): Project { return { id: 0, title: '', problem: '', tech_stack: [], metrics_impact: '', link: '', status: 'idea' } }

const st = (s: string) => PROJECT_STATUS.find(x => x.id === s) ?? PROJECT_STATUS[0]

export default function ProjectPortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editing, setEditing] = useState<Project | null>(null)

  function load() { fetch('/api/dataml/projects').then(r => r.json()).then((rows: Raw[]) => setProjects(rows.map(parse))) }
  useEffect(load, [])

  async function save(p: Project) {
    await fetch('/api/dataml/projects', { method: p.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
    setEditing(null); load()
  }
  async function del(id: number) { if (!confirm('Delete project?')) return; await fetch(`/api/dataml/projects?id=${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={label}>{projects.length} projects · end-to-end work for your CV</div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ New Project</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {projects.map(p => {
          const s = st(p.status)
          return (
            <div key={p.id} className="card" style={{ padding: 14, borderTop: `2px solid ${s.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.title || 'Untitled'}</div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: s.color + '20', color: s.color, whiteSpace: 'nowrap', height: 'fit-content' }}>{s.label}</span>
              </div>
              {p.problem && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.5 }}>{p.problem}</div>}
              {p.metrics_impact && (
                <div style={{ marginTop: 8, padding: '5px 8px', borderRadius: 4, background: '#00d4aa12', border: '1px solid #00d4aa30' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#00d4aa' }}>📊 IMPACT </span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{p.metrics_impact}</span>
                </div>
              )}
              {p.tech_stack.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {p.tech_stack.map(t => <span key={t} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 3, background: '#3b82f618', color: '#60a5fa' }}>{t}</span>)}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <button onClick={() => setEditing(p)} style={btnGhost}>Edit</button>
                <button onClick={() => del(p.id)} style={{ ...btnGhost, color: '#f43f5e' }}>Delete</button>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontSize: 11, color: '#60a5fa' }}>↗ Demo / Repo</a>}
              </div>
            </div>
          )
        })}
        {projects.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No projects yet. Add end-to-end work with quantified impact for your CV.</div>}
      </div>

      {editing && <ProjectEditor project={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function ProjectEditor({ project, onSave, onCancel }: { project: Project; onSave: (p: Project) => void; onCancel: () => void }) {
  const [p, setP] = useState(project)
  const set = (k: keyof Project, v: unknown) => setP(prev => ({ ...prev, [k]: v }))
  const toggleTech = (t: string) => set('tech_stack', p.tech_stack.includes(t) ? p.tech_stack.filter(x => x !== t) : [...p.tech_stack, t])
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{p.id ? 'Edit' : 'New'} Project</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field l="Project Title"><input style={inp} value={p.title} placeholder="e.g. Churn prediction for a SaaS co." onChange={e => set('title', e.target.value)} /></Field>
          <Field l="Status">
            <select style={inp} value={p.status} onChange={e => set('status', e.target.value)}>
              {PROJECT_STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        </div>
        <Field l="Core Business / Technical Problem"><textarea style={textarea} value={p.problem} placeholder="What problem does it solve? Why does it matter?" onChange={e => set('problem', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Metrics / Impact (Quantified)"><input style={inp} value={p.metrics_impact} placeholder="e.g. 'Improved AUC to 0.89, cut churn 12%'" onChange={e => set('metrics_impact', e.target.value)} /></Field>
        <div style={{ height: 10 }} />
        <Field l="Live Demo / Repository Link"><input style={inp} value={p.link} placeholder="https://github.com/..." onChange={e => set('link', e.target.value)} /></Field>
        <div style={{ height: 12 }} />
        <div style={label}>Tech Stack</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {TECH_TAGS.map(t => {
            const on = p.tech_stack.includes(t)
            return <button key={t} onClick={() => toggleTech(t)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 4, fontWeight: 600, cursor: 'pointer', background: on ? '#3b82f620' : 'var(--bg-surface)', border: `1px solid ${on ? '#3b82f660' : 'var(--border)'}`, color: on ? '#60a5fa' : 'var(--text-muted)' }}>{t}</button>
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={() => onSave(p)} style={btnPrimary}>Save Project</button>
        </div>
      </div>
    </div>
  )
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><div style={label}>{l}</div>{children}</label>
}
