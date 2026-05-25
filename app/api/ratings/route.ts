import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { article_id, stars } = await req.json()
  if (!article_id || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { error } = await supabase
    .from('ratings')
    .upsert(
      { user_id: user.id, article_id, stars, rated_at: new Date().toISOString() },
      { onConflict: 'user_id,article_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update taste profile based on article's focus area
  const { data: article } = await supabase
    .from('articles')
    .select('source_id, sources(focus_area)')
    .eq('id', article_id)
    .single()

  const focusArea = (article as { sources?: { focus_area?: string } } | null)?.sources?.focus_area
  if (focusArea) {
    const { data: existing } = await supabase
      .from('taste_profile')
      .select('score')
      .eq('user_id', user.id)
      .eq('category', focusArea)
      .single()

    const currentScore = existing?.score ?? 5
    // Exponential moving average weighted toward new rating
    const newScore = Math.min(10, currentScore * 0.8 + stars * 2 * 0.2)

    await supabase
      .from('taste_profile')
      .upsert(
        { user_id: user.id, category: focusArea, score: newScore, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,category' }
      )
  }

  return NextResponse.json({ ok: true })
}
