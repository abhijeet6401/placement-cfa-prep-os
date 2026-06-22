import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM consulting_cases ORDER BY case_date DESC, id DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO consulting_cases (case_date, title, case_type, partner, g_clarify, g_structure, g_math, g_synth, partner_feedback, self_reflection)
    VALUES (@case_date, @title, @case_type, @partner, @g_clarify, @g_structure, @g_math, @g_synth, @partner_feedback, @self_reflection)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    UPDATE consulting_cases SET
      case_date=@case_date, title=@title, case_type=@case_type, partner=@partner,
      g_clarify=@g_clarify, g_structure=@g_structure, g_math=@g_math, g_synth=@g_synth,
      partner_feedback=@partner_feedback, self_reflection=@self_reflection
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM consulting_cases WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    case_date: b.case_date ?? new Date().toISOString().split('T')[0],
    title: b.title ?? '', case_type: b.case_type ?? 'Profitability', partner: b.partner ?? '',
    g_clarify: b.g_clarify ?? 0, g_structure: b.g_structure ?? 0, g_math: b.g_math ?? 0, g_synth: b.g_synth ?? 0,
    partner_feedback: b.partner_feedback ?? '', self_reflection: b.self_reflection ?? '',
  }
}
