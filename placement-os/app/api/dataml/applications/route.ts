import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getDb().prepare('SELECT * FROM ml_applications ORDER BY sort, id').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const info = getDb().prepare(`
    INSERT INTO ml_applications (company, role_focus, target_day, status, requirements)
    VALUES (@company, @role_focus, @target_day, @status, @requirements)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare(`
    UPDATE ml_applications SET company=@company, role_focus=@role_focus, target_day=@target_day,
      status=@status, requirements=@requirements, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM ml_applications WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    company: b.company ?? 'New Company', role_focus: b.role_focus ?? 'Data Analyst',
    target_day: b.target_day ?? 'Day 1', status: b.status ?? 'cv_verification',
    requirements: b.requirements ?? '',
  }
}
