import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM pei_stories ORDER BY id DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO pei_stories (dimension, title, situation, task, action, result, impact)
    VALUES (@dimension, @title, @situation, @task, @action, @result, @impact)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    UPDATE pei_stories SET
      dimension=@dimension, title=@title, situation=@situation, task=@task,
      action=@action, result=@result, impact=@impact
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM pei_stories WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    dimension: b.dimension ?? 'Entrepreneurial Drive', title: b.title ?? '',
    situation: b.situation ?? '', task: b.task ?? '', action: b.action ?? '',
    result: b.result ?? '', impact: b.impact ?? '',
  }
}
