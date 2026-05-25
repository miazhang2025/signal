import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { buildFeed, rankingScore } from '@/lib/ranking'
import { Article } from '@/types'
import NewspaperLayout from '@/components/NewspaperLayout'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch sources
  const { data: sources } = await supabase
    .from('sources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch articles from the last 7 days
  // Fetch articles added in the last 7 days (created_at = when we fetched them)
  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data: articles } = await supabase
    .from('articles')
    .select(`
      *,
      source:sources!inner(*)
    `)
    .gte('created_at', since.toISOString())
    .in('source_id', (sources ?? []).map((s) => s.id))
    .order('published_at', { ascending: false })
    .limit(50)

  // Fetch user ratings for today
  const { data: ratings } = await supabase
    .from('ratings')
    .select('article_id, stars')
    .eq('user_id', user.id)

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

  return (
    <NewspaperLayout
      feed={feed}
      sources={sources ?? []}
    />
  )
}
