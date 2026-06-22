import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM cfa_progress').all()
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { reading_id, topic_id, status, confidence, notes } = await req.json()
  const db = getDb()
  db.prepare(`
    INSERT INTO cfa_progress (reading_id, topic_id, status, confidence, notes, last_reviewed, updated_at)
    VALUES (@reading_id, @topic_id, @status, @confidence, @notes, datetime('now'), datetime('now'))
    ON CONFLICT(reading_id) DO UPDATE SET
      status = @status,
      confidence = @confidence,
      notes = @notes,
      last_reviewed = datetime('now'),
      updated_at = datetime('now')
  `).run({
    reading_id, topic_id,
    status: status ?? 'not_started',
    confidence: confidence ?? 0,
    notes: notes ?? '',
  })
  return NextResponse.json({ ok: true })
}
