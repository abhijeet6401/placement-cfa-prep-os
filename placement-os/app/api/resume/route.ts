import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getDb().prepare('SELECT * FROM resume_bullets ORDER BY id').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const info = getDb().prepare(`
    INSERT INTO resume_bullets (section, bullet, follow_up_questions, methodology, quantified_impact, track, strength)
    VALUES (@section, @bullet, @follow_up_questions, @methodology, @quantified_impact, @track, @strength)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare(`
    UPDATE resume_bullets SET section=@section, bullet=@bullet, follow_up_questions=@follow_up_questions,
      methodology=@methodology, quantified_impact=@quantified_impact, track=@track, strength=@strength,
      updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM resume_bullets WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    section: b.section ?? 'Experience', bullet: b.bullet ?? '',
    follow_up_questions: b.follow_up_questions ?? '', methodology: b.methodology ?? '',
    quantified_impact: b.quantified_impact ?? '', track: b.track ?? 'all', strength: b.strength ?? 1,
  }
}
