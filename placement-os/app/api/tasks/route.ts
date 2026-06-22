import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { generateDailyPlan } from '@/lib/scheduler'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') ?? new Date().toISOString().split('T')[0]
  const db = getDb()
  const rows = db.prepare('SELECT task_id FROM completed_tasks WHERE date = ?').all(date) as { task_id: string }[]
  const completedIds = rows.map(r => r.task_id)
  const plan = generateDailyPlan(new Date(date), completedIds)
  // Merge completed state
  plan.tasks = plan.tasks.map(t => ({ ...t, completed: completedIds.includes(t.id) }))
  return NextResponse.json(plan)
}

export async function POST(req: NextRequest) {
  const { date, task_id, track, completed } = await req.json()
  const db = getDb()
  if (completed) {
    db.prepare(`
      INSERT OR IGNORE INTO completed_tasks (date, task_id, track) VALUES (?, ?, ?)
    `).run(date, task_id, track)
  } else {
    db.prepare('DELETE FROM completed_tasks WHERE date = ? AND task_id = ?').run(date, task_id)
  }
  return NextResponse.json({ ok: true })
}
