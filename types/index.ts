export type Platform = 'twitter' | 'linkedin' | 'blog' | 'rss' | 'reddit' | 'arxiv' | 'news'

export type FocusArea =
  | 'AI Trends'
  | 'Creative Tech'
  | 'Tech Art'
  | 'Generative Design'
  | 'Real-Time Graphics'
  | 'Tools & Pipelines'

export interface Source {
  id: string
  user_id: string
  name: string
  url: string
  platform: Platform
  focus_area: FocusArea | null
  is_ai_pick: boolean
  is_promoted: boolean
  created_at: string
}

export interface Article {
  id: string
  source_id: string
  title: string
  excerpt: string | null
  url: string
  image_url: string | null
  published_at: string
  relevance_score: number
  platform: Platform
  author_handle: string | null
  // joined from sources
  source?: Source
  // computed
  user_rating?: number
  ranking_score?: number
  slot?: 'hero' | 'secondary' | 'grid' | 'sidebar'
}

export interface Rating {
  id: string
  user_id: string
  article_id: string
  stars: number
  rated_at: string
}

export interface TasteProfile {
  id: string
  user_id: string
  category: string
  score: number
  updated_at: string
}

export interface RankedFeed {
  hero: Article | null
  secondary: Article[]
  grid: Article[]
  sidebar: Article[]
}

export interface AddSourcePayload {
  name: string
  url: string
  platform: Platform
  focus_area: FocusArea | null
}
