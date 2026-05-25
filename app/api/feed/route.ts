import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildFeed, rankingScore } from '@/lib/ranking'
import { Article } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch articles from today + ratings
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      *,
      source:sources!inner(*)
    `)
    .gte('published_at', since.toISOString())
    .eq('sources.user_id', user.id)
    .order('published_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch user ratings for today
  const { data: ratings } = await supabase
    .from('ratings')
    .select('article_id, stars')
    .eq('user_id', user.id)
    .gte('rated_at', since.toISOString())

  const ratingMap: Record<string, number> = {}
  for (const r of ratings ?? []) {
    ratingMap[r.article_id] = r.stars
  }

  const enriched: Article[] = (articles ?? []).map((a) => ({
    ...a,
    user_rating: ratingMap[a.id] ?? 0,
    ranking_score: rankingScore({ ...a, user_rating: ratingMap[a.id] ?? 0 }),
  }))

  const feed = buildFeed(enriched)
  return NextResponse.json(feed)
}
