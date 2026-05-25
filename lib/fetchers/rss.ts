import Parser from 'rss-parser'

type RSSItem = Parser.Item & {
  'media:content'?: { $?: { url?: string } }
  'media:thumbnail'?: { $?: { url?: string } }
  enclosure?: { url?: string }
}

const parser = new Parser<Record<string, unknown>, RSSItem>({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure'],
  },
})

export interface FeedItem {
  title: string
  link: string
  excerpt: string
  image_url: string | null
  published_at: string
  author_handle: string | null
}

export async function fetchRSS(feedUrl: string): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl)
    return feed.items.slice(0, 20).map((item) => ({
      title: item.title ?? 'Untitled',
      link: item.link ?? '',
      excerpt: stripHtml(item.contentSnippet ?? item.summary ?? '').slice(0, 300),
      image_url: extractImage(item),
      published_at: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      author_handle: item.creator ?? (item as unknown as { author?: string }).author ?? null,
    }))
  } catch (err) {
    console.error('[RSS] Failed to fetch', feedUrl, err)
    return []
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function extractImage(item: RSSItem): string | null {
  if (item['media:content']?.['$']?.url) return item['media:content']['$']!.url!
  if (item['media:thumbnail']?.['$']?.url) return item['media:thumbnail']['$']!.url!
  if (item.enclosure?.url) return item.enclosure.url
  const match = (item.content ?? '').match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}
