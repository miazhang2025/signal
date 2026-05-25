import { Article, RankedFeed } from '@/types'
import { differenceInHours } from 'date-fns'

export function recencyBoost(publishedAt: string): number {
  const hours = differenceInHours(new Date(), new Date(publishedAt))
  if (hours < 3) return 1.0
  if (hours < 6) return 0.7
  if (hours < 12) return 0.4
  if (hours < 24) return 0.1
  return 0
}

export function rankingScore(article: Article): number {
  const userRating = article.user_rating ?? 0
  const relevance = article.relevance_score ?? 0.5
  const boost = recencyBoost(article.published_at)
  return userRating * 0.7 + relevance * 0.3 + boost
}

export function buildFeed(articles: Article[]): RankedFeed {
  const sorted = [...articles].sort((a, b) => {
    const sa = rankingScore(a)
    const sb = rankingScore(b)
    return sb - sa
  })

  const [hero, ...rest] = sorted
  const secondary = rest.slice(0, 2)
  const grid = rest.slice(2, 8)
  const sidebar = rest.slice(8)

  return {
    hero: hero ?? null,
    secondary,
    grid,
    sidebar,
  }
}
