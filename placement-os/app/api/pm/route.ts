import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const round = req.nextUrl.searchParams.get('round')
  const db = getDb()
  const rows = round
    ? db.prepare('SELECT * FROM pm_entries WHERE round = ? ORDER BY updated_at DESC').all(round)
    : db.prepare('SELECT * FROM pm_entries ORDER BY updated_at DESC').all()
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO pm_entries (round, title, data, confidence, feedback, feedback_tags)
    VALUES (@round, @title, @data, @confidence, @feedback, @feedback_tags)
  `).run({
    round: b.round, title: b.title ?? 'Untitled',
    data: JSON.stringify(b.data ?? {}),
    confidence: b.confidence ?? 1,
    feedback: b.feedback ?? '',
    feedback_tags: JSON.stringify(b.feedback_tags ?? []),
  })
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    UPDATE pm_entries SET
      title=@title, data=@data, confidence=@confidence,
      feedback=@feedback, feedback_tags=@feedback_tags, updated_at=datetime('now')
    WHERE id=@id
  `).run({
    id: b.id, title: b.title ?? 'Untitled',
    data: JSON.stringify(b.data ?? {}),
    confidence: b.confidence ?? 1,
    feedback: b.feedback ?? '',
    feedback_tags: JSON.stringify(b.feedback_tags ?? []),
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const db = getDb()
  db.prepare('DELETE FROM pm_entries WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
