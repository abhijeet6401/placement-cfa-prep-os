import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM consulting_settings').all() as { key: string; value: string }[]
  const map: Record<string, string> = {}
  rows.forEach(r => { map[r.key] = r.value })
  return NextResponse.json({ weekly_target: map.weekly_target ?? '10' })
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO consulting_settings (key, value) VALUES (@key, @value)
    ON CONFLICT(key) DO UPDATE SET value=@value
  `).run({ key: b.key, value: String(b.value) })
  return NextResponse.json({ ok: true })
}
