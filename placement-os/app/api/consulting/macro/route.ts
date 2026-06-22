import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { DEFAULT_MACRO } from '@/lib/consulting-config'

export async function GET() {
  const db = getDb()
  const count = (db.prepare('SELECT COUNT(*) c FROM macro_refs').get() as { c: number }).c
  if (count === 0) {
    const insert = db.prepare('INSERT INTO macro_refs (label, value, unit, source) VALUES (?, ?, ?, ?)')
    const seed = db.transaction(() => { for (const m of DEFAULT_MACRO) insert.run(m.label, m.value, m.unit, m.source) })
    seed()
  }
  return NextResponse.json(db.prepare('SELECT * FROM macro_refs ORDER BY id').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare('INSERT INTO macro_refs (label, value, unit, source) VALUES (?, ?, ?, ?)')
    .run(b.label ?? 'New metric', b.value ?? '', b.unit ?? '', b.source ?? '')
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare("UPDATE macro_refs SET label=?, value=?, unit=?, source=?, updated_at=datetime('now') WHERE id=?")
    .run(b.label ?? '', b.value ?? '', b.unit ?? '', b.source ?? '', b.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM macro_refs WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
