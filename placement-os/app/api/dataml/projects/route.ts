import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getDb().prepare('SELECT * FROM ml_projects ORDER BY updated_at DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const info = getDb().prepare(`
    INSERT INTO ml_projects (title, problem, tech_stack, metrics_impact, link, status)
    VALUES (@title, @problem, @tech_stack, @metrics_impact, @link, @status)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare(`
    UPDATE ml_projects SET title=@title, problem=@problem, tech_stack=@tech_stack,
      metrics_impact=@metrics_impact, link=@link, status=@status, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM ml_projects WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    title: b.title ?? 'Untitled project', problem: b.problem ?? '',
    tech_stack: JSON.stringify(b.tech_stack ?? []),
    metrics_impact: b.metrics_impact ?? '', link: b.link ?? '', status: b.status ?? 'idea',
  }
}
