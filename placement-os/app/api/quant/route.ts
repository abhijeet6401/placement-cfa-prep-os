import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM quant_signals ORDER BY run_date DESC, id DESC').all())
}

export async function POST(req: NextRequest) {
  const b = await req.json()
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO quant_signals (strategy_name, run_date, sharpe, fitness, returns, max_drawdown, universe, notes)
    VALUES (@strategy_name, @run_date, @sharpe, @fitness, @returns, @max_drawdown, @universe, @notes)
  `).run({
    strategy_name: b.strategy_name ?? 'Untitled Strategy',
    run_date: b.run_date ?? new Date().toISOString().split('T')[0],
    sharpe: b.sharpe ?? null, fitness: b.fitness ?? null, returns: b.returns ?? null,
    max_drawdown: b.max_drawdown ?? null, universe: b.universe ?? '', notes: b.notes ?? '',
  })
  return NextResponse.json({ id: info.lastInsertRowid })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const db = getDb()
  db.prepare('DELETE FROM quant_signals WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
