import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getDb().prepare('SELECT * FROM ml_research ORDER BY updated_at DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const info = getDb().prepare(`
    INSERT INTO ml_research (company, ai_initiatives, tech_stack, prev_questions, notes)
    VALUES (@company, @ai_initiatives, @tech_stack, @prev_questions, @notes)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare(`
    UPDATE ml_research SET company=@company, ai_initiatives=@ai_initiatives, tech_stack=@tech_stack,
      prev_questions=@prev_questions, notes=@notes, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM ml_research WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    company: b.company ?? 'New Company', ai_initiatives: b.ai_initiatives ?? '',
    tech_stack: b.tech_stack ?? '', prev_questions: b.prev_questions ?? '', notes: b.notes ?? '',
  }
}
