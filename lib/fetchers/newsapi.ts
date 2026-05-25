export interface NewsItem {
  title: string
  link: string
  excerpt: string
  image_url: string | null
  published_at: string
  author_handle: string | null
  source_name: string
}

export async function fetchNewsAPI(query: string, pageSize = 20): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    console.warn('[NewsAPI] No API key configured')
    return []
  }

  try {
    const url = new URL('https://newsapi.org/v2/everything')
    url.searchParams.set('q', query)
    url.searchParams.set('pageSize', String(pageSize))
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('language', 'en')
    url.searchParams.set('apiKey', apiKey)

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`NewsAPI failed: ${res.status}`)
    const data = await res.json()

    return (data.articles ?? [])
      .filter((a: { title?: string }) => a.title && a.title !== '[Removed]')
      .map((a: {
        title: string
        url: string
        description: string | null
        urlToImage: string | null
        publishedAt: string
        author: string | null
        source: { name: string }
      }) => ({
        title: a.title,
        link: a.url,
        excerpt: a.description ?? '',
        image_url: a.urlToImage,
        published_at: a.publishedAt,
        author_handle: a.author,
        source_name: a.source.name,
      }))
  } catch (err) {
    console.error('[NewsAPI] Failed query:', query, err)
    return []
  }
}
