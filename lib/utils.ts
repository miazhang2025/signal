import { formatDistanceToNowStrict } from 'date-fns'

export function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNowStrict(new Date(dateStr), { addSuffix: true })
  } catch {
    return ''
  }
}

export function platformLabel(platform: string): string {
  const map: Record<string, string> = {
    twitter: 'X',
    linkedin: 'LinkedIn',
    blog: 'Blog',
    rss: 'RSS',
    reddit: 'Reddit',
    arxiv: 'arXiv',
    news: 'News',
  }
  return map[platform] ?? platform
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    twitter: '#0a0a0a',
    linkedin: '#0077b5',
    blog: '#888',
    rss: '#f26522',
    reddit: '#ff4500',
    arxiv: '#b31b1b',
    news: '#444',
  }
  return map[platform] ?? '#888'
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

const PLACEHOLDER_COLORS = [
  '#ff1a6e22',
  '#0a0a0a11',
  '#ffe0ed',
  '#ddd8cc',
]

export function placeholderColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length]
}
