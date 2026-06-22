import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { DEFAULT_SECTORS } from '@/lib/consulting-config'

export async function GET() {
  const db = getDb()
  // Seed default sectors on first access
  const existing = db.prepare('SELECT sector FROM sector_playbook').all() as { sector: string }[]
  const have = new Set(existing.map(e => e.sector))
  const insert = db.prepare('INSERT INTO sector_playbook (sector, value_chain, players, notes) VALUES (?, ?, ?, ?)')
  for (const s of DEFAULT_SECTORS) {
    if (!have.has(s)) insert.run(s, '{}', '[]', '')
  }
  return NextResponse.json(db.prepare('SELECT * FROM sector_playbook').all())
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO sector_playbook (sector, value_chain, players, notes, updated_at)
    VALUES (@sector, @value_chain, @players, @notes, datetime('now'))
    ON CONFLICT(sector) DO UPDATE SET
      value_chain=@value_chain, players=@players, notes=@notes, updated_at=datetime('now')
  `).run({
    sector: b.sector,
    value_chain: JSON.stringify(b.value_chain ?? {}),
    players: JSON.stringify(b.players ?? []),
    notes: b.notes ?? '',
  })
  return NextResponse.json({ ok: true })
}
