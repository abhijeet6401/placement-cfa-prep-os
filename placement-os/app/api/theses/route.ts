import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM theses ORDER BY updated_at DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO theses (ticker, company, sector, direction, conviction, target_price, current_price, time_horizon, catalyst, thesis, risks, status)
    VALUES (@ticker, @company, @sector, @direction, @conviction, @target_price, @current_price, @time_horizon, @catalyst, @thesis, @risks, @status)
  `).run({
    ticker: b.ticker ?? '', company: b.company ?? 'Untitled', sector: b.sector ?? '',
    direction: b.direction ?? 'long', conviction: b.conviction ?? 3,
    target_price: b.target_price ?? null, current_price: b.current_price ?? null,
    time_horizon: b.time_horizon ?? '', catalyst: b.catalyst ?? '',
    thesis: b.thesis ?? '', risks: b.risks ?? '', status: b.status ?? 'draft',
  })
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  db.prepare(`
    UPDATE theses SET
      ticker=@ticker, company=@company, sector=@sector, direction=@direction,
      conviction=@conviction, target_price=@target_price, current_price=@current_price,
      time_horizon=@time_horizon, catalyst=@catalyst, thesis=@thesis, risks=@risks,
      status=@status, updated_at=datetime('now')
    WHERE id=@id
  `).run({
    id: b.id, ticker: b.ticker ?? '', company: b.company ?? 'Untitled', sector: b.sector ?? '',
    direction: b.direction ?? 'long', conviction: b.conviction ?? 3,
    target_price: b.target_price ?? null, current_price: b.current_price ?? null,
    time_horizon: b.time_horizon ?? '', catalyst: b.catalyst ?? '',
    thesis: b.thesis ?? '', risks: b.risks ?? '', status: b.status ?? 'draft',
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const db = getDb()
  db.prepare('DELETE FROM theses WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
