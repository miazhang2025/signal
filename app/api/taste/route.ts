import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('taste_profile')
    .select('*')
    .eq('user_id', user.id)
    .order('score', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { preferences }: { preferences: { category: string; score: number }[] } = await req.json()
  if (!Array.isArray(preferences)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const rows = preferences.map((p) => ({
    user_id: user.id,
    category: p.category,
    score: p.score,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('taste_profile')
    .upsert(rows, { onConflict: 'user_id,category' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
