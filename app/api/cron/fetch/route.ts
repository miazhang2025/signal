import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { fetchRSS, type FeedItem } from '@/lib/fetchers/rss'
import { fetchTwitterTimeline } from '@/lib/fetchers/twitter'
import { fetchNewsAPI } from '@/lib/fetchers/newsapi'
import { Source } from '@/types'

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

  // Fetch all user sources
  const { data: sources, error } = await supabase
    .from('sources')
    .select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const articlesToInsert: {
    source_id: string
    title: string
    excerpt: string | null
    url: string
    image_url: string | null
    published_at: string
    relevance_score: number
    platform: string
    author_handle: string | null
  }[] = []

  for (const source of (sources as Source[])) {
    let items: { title: string; link: string; excerpt: string; image_url: string | null; published_at: string; author_handle: string | null }[] = []

    if (source.platform === 'twitter') {
      // Extract username from URL or use name
      const handle = source.url.replace('https://twitter.com/', '').replace('https://x.com/', '').replace('@', '')
      items = await fetchTwitterTimeline(handle)
    } else if (source.platform === 'news') {
      const newsItems = await fetchNewsAPI(source.name)
      items = newsItems.map((n) => ({
        title: n.title,
        link: n.link,
        excerpt: n.excerpt,
        image_url: n.image_url,
        published_at: n.published_at,
        author_handle: n.author_handle,
      }))
    } else {
      // RSS / blog / newsletter / reddit / arxiv
      items = await fetchRSS(source.url)
    }

    for (const item of items) {
      articlesToInsert.push({
        source_id: source.id,
        title: item.title,
        excerpt: item.excerpt,
        url: item.link,
        image_url: item.image_url,
        published_at: item.published_at,
        relevance_score: 0.5,
        platform: source.platform,
        author_handle: item.author_handle,
      })
    }
  }

  if (articlesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('articles')
      .upsert(articlesToInsert, { onConflict: 'url' })

    if (insertError) {
      console.error('[cron/fetch] Insert error:', insertError)
    }
  }

  return NextResponse.json({ fetched: articlesToInsert.length })
}
