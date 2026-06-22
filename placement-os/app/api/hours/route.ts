import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') ?? new Date().toISOString().split('T')[0]
  const db = getDb()
  const row = db.prepare('SELECT * FROM daily_hours WHERE date = ?').get(date)
  return NextResponse.json(row ?? { date, logged_hours: 0, track_breakdown: '{}' })
}

export async function POST(req: NextRequest) {
  const { date, logged_hours, track_breakdown } = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO daily_hours (date, logged_hours, track_breakdown)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      logged_hours = excluded.logged_hours,
      track_breakdown = excluded.track_breakdown
  `).run(date, logged_hours, JSON.stringify(track_breakdown))
  return NextResponse.json({ ok: true })
}
