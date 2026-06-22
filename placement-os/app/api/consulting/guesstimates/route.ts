import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM guesstimates ORDER BY created_at DESC, id DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO guesstimates (prompt, approach, assumption_tree, data_cuts, estimate, actual, notes)
    VALUES (@prompt, @approach, @assumption_tree, @data_cuts, @estimate, @actual, @notes)
  `).run(norm(b))
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    UPDATE guesstimates SET
      prompt=@prompt, approach=@approach, assumption_tree=@assumption_tree,
      data_cuts=@data_cuts, estimate=@estimate, actual=@actual, notes=@notes
    WHERE id=@id
  `).run({ ...norm(b), id: b.id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  getDb().prepare('DELETE FROM guesstimates WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}

function norm(b: Record<string, unknown>) {
  return {
    prompt: b.prompt ?? 'Untitled guesstimate',
    approach: b.approach ?? 'bottom_up',
    assumption_tree: JSON.stringify(b.assumption_tree ?? []),
    data_cuts: JSON.stringify(b.data_cuts ?? []),
    estimate: b.estimate ?? null, actual: b.actual ?? null, notes: b.notes ?? '',
  }
}
