import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getDb().prepare('SELECT * FROM companies ORDER BY id').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const info = getDb().prepare('INSERT INTO companies (name, tier, track, status, notes) VALUES (?, ?, ?, ?, ?)')
    .run(b.name ?? 'New Company', b.tier ?? 'day1', b.track ?? 'all', b.status ?? 'target', b.notes ?? '')
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare('UPDATE companies SET name=?, tier=?, track=?, status=?, notes=? WHERE id=?')
    .run(b.name, b.tier, b.track, b.status, b.notes ?? '', b.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM companies WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
