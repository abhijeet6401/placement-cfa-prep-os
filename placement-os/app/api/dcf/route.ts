import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM dcf_models ORDER BY updated_at DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO dcf_models (name, model_type, link, wacc, terminal_growth, implied_value, checklist, notes)
    VALUES (@name, @model_type, @link, @wacc, @terminal_growth, @implied_value, @checklist, @notes)
  `).run({
    name: b.name ?? 'Untitled Model', model_type: b.model_type ?? 'dcf',
    link: b.link ?? '', wacc: b.wacc ?? null, terminal_growth: b.terminal_growth ?? null,
    implied_value: b.implied_value ?? null,
    checklist: JSON.stringify(b.checklist ?? {}), notes: b.notes ?? '',
  })
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    UPDATE dcf_models SET
      name=@name, model_type=@model_type, link=@link, wacc=@wacc,
      terminal_growth=@terminal_growth, implied_value=@implied_value,
      checklist=@checklist, notes=@notes, updated_at=datetime('now')
    WHERE id=@id
  `).run({
    id: b.id, name: b.name ?? 'Untitled Model', model_type: b.model_type ?? 'dcf',
    link: b.link ?? '', wacc: b.wacc ?? null, terminal_growth: b.terminal_growth ?? null,
    implied_value: b.implied_value ?? null,
    checklist: JSON.stringify(b.checklist ?? {}), notes: b.notes ?? '',
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const db = getDb()
  db.prepare('DELETE FROM dcf_models WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
