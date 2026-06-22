import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { SEED_SKILLS } from '@/lib/dataml-config'

export async function GET() {
  const db = getDb()
  const count = (db.prepare('SELECT COUNT(*) c FROM ml_skills').get() as { c: number }).c
  if (count === 0) {
    const insert = db.prepare('INSERT INTO ml_skills (category, topic, sort) VALUES (?, ?, ?)')
    const seed = db.transaction(() => SEED_SKILLS.forEach((s, i) => insert.run(s.category, s.topic, i)))
    seed()
  }
  return NextResponse.json(db.prepare('SELECT * FROM ml_skills ORDER BY sort, id').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare('INSERT INTO ml_skills (category, topic, proficiency, last_reviewed, next_action) VALUES (?, ?, ?, ?, ?)')
    .run(b.category ?? 'DSA', b.topic ?? 'New topic', b.proficiency ?? 'Beginner', b.last_reviewed ?? '', b.next_action ?? '')
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  getDb().prepare('UPDATE ml_skills SET category=?, topic=?, proficiency=?, last_reviewed=?, next_action=? WHERE id=?')
    .run(b.category, b.topic, b.proficiency, b.last_reviewed ?? '', b.next_action ?? '', b.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM ml_skills WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
