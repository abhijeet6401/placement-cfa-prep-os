import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getDb().prepare('SELECT * FROM aptitude_log ORDER BY log_date DESC, id DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const info = getDb().prepare(`
    INSERT INTO aptitude_log (log_date, category, count, correct, minutes, notes)
    VALUES (@log_date, @category, @count, @correct, @minutes, @notes)
  `).run({
    log_date: b.log_date ?? new Date().toISOString().split('T')[0],
    category: b.category ?? 'Probability',
    count: b.count ?? 0, correct: b.correct ?? 0, minutes: b.minutes ?? 0, notes: b.notes ?? '',
  })
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM aptitude_log WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
