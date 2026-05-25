import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { curateContent } from '@/lib/anthropic'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const headerSecret = req.headers.get('x-cron-secret')
  const authHeader = req.headers.get('authorization')
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (headerSecret !== cronSecret && bearerSecret !== cronSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServiceClient()

  // Get all users
  const { data: users } = await supabase.auth.admin.listUsers()

  let totalScored = 0

  for (const user of users?.users ?? []) {
    // Get taste profile
    const { data: tasteProfile } = await supabase
      .from('taste_profile')
      .select('category, score')
      .eq('user_id', user.id)

    // Get user sources
    const { data: sources } = await supabase
      .from('sources')
      .select('name, url, platform')
      .eq('user_id', user.id)

    // Get today's unscored articles from user's sources
    const since = new Date()
    since.setHours(0, 0, 0, 0)

    const { data: articles } = await supabase
      .from('articles')
      .select('id, title, excerpt, platform, source:sources(name)')
      .gte('published_at', since.toISOString())
      .eq('relevance_score', 0.5)
      .limit(30)

    if (!articles?.length) continue

    try {
      const result = await curateContent(
        tasteProfile ?? [],
        sources ?? [],
        articles.map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt ?? '',
          platform: a.platform,
          source_name: (a.source as unknown as { name: string } | null)?.name ?? '',
        }))
      )

      // Update relevance scores
      for (const scored of result.article_scores) {
        await supabase
          .from('articles')
          .update({ relevance_score: scored.relevance_score })
          .eq('id', scored.article_id)
        totalScored++
      }

      // Insert AI-suggested sources
      for (const suggested of result.suggested_sources) {
        await supabase
          .from('sources')
          .upsert(
            {
              user_id: user.id,
              name: suggested.name,
              url: suggested.url,
              platform: suggested.platform,
              focus_area: suggested.focus_area,
              is_ai_pick: true,
              is_promoted: false,
            },
            { onConflict: 'user_id,url' }
          )
      }
    } catch (err) {
      console.error('[cron/curate] Failed for user', user.id, err)
    }
  }

  return NextResponse.json({ scored: totalScored })
}
