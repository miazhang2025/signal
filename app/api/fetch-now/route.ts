import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { fetchRSS } from '@/lib/fetchers/rss'
import { fetchTwitterTimeline } from '@/lib/fetchers/twitter'
import { fetchNewsAPI } from '@/lib/fetchers/newsapi'
import { Source } from '@/types'

export const maxDuration = 60

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceSupabase = createServiceClient()

  const { data: sources } = await serviceSupabase
    .from('sources')
    .select('*')
    .eq('user_id', user.id)

  const articlesToInsert: {
    source_id: string; title: string; excerpt: string | null; url: string
    image_url: string | null; published_at: string; relevance_score: number
    platform: string; author_handle: string | null
  }[] = []

  for (const source of (sources ?? []) as Source[]) {
    let items: { title: string; link: string; excerpt: string; image_url: string | null; published_at: string; author_handle: string | null }[] = []

    if (source.platform === 'twitter') {
      const handle = source.url.replace('https://twitter.com/', '').replace('https://x.com/', '').replace('@', '')
      items = await fetchTwitterTimeline(handle)
    } else if (source.platform === 'news') {
      items = (await fetchNewsAPI(source.name)).map((n) => ({ ...n, link: n.link }))
    } else {
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
    await serviceSupabase.from('articles').upsert(articlesToInsert, { onConflict: 'url' })
  }

  return NextResponse.json({ fetched: articlesToInsert.length })
}
