'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Article } from '@/types'
import { timeAgo, platformLabel, platformColor, placeholderColor } from '@/lib/utils'
import RatingStars from './RatingStars'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'hero' | 'secondary'
  onRated?: (articleId: string, stars: number) => void
}

export default function ArticleCard({ article, variant = 'default', onRated }: ArticleCardProps) {
  const [promoted, setPromoted] = useState(false)
  const [userRating, setUserRating] = useState(article.user_rating ?? 0)

  const isUserSource = article.source && !article.source.is_ai_pick
  const isAIPick = article.source?.is_ai_pick && !article.source?.is_promoted
  const isHero = variant === 'hero'
  const isSecondary = variant === 'secondary'

  const imageHeight = isHero ? 180 : isSecondary ? 120 : 90

  async function handlePromote(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    await fetch(`/api/sources/${article.source_id}/promote`, { method: 'POST' })
    setPromoted(true)
  }

  function handleRate(stars: number) {
    setUserRating(stars)
    onRated?.(article.id, stars)
  }

  const borderStyle: React.CSSProperties = isUserSource
    ? { borderLeft: '5px solid var(--pink)' }
    : isAIPick
    ? { borderLeft: '5px solid var(--ink)' }
    : isHero
    ? { border: '2px solid var(--ink)' }
    : { border: '1px solid var(--gray-light)' }

  const sectionTag = article.source?.focus_area?.toUpperCase() ?? 'AI TRENDS'

  return (
    <article
      className="article-card"
      style={{
        ...borderStyle,
        backgroundColor: 'var(--paper)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Clickable area (image + content) */}
      <div
        style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column' }}
        onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
      >
      {/* Cover image */}
      <div
        style={{
          height: imageHeight,
          position: 'relative',
          backgroundColor: placeholderColor(article.id),
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <Image
          src={article.image_url ?? '/placeholder.png'}
          alt={article.title}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>

      {/* Content */}
      <div style={{ padding: isHero ? '16px' : '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Labels row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {isUserSource && <span className="user-src-label">YOUR SOURCE</span>}
          {isAIPick && !promoted && (
            <span className="ai-pick-label">AI CURATED · 20%</span>
          )}

          <span
            style={{
              fontFamily: 'Boldonse, serif',
              fontSize: '0.55rem',
              letterSpacing: '3px',
              color: 'var(--gray-mid)',
              textTransform: 'uppercase',
            }}
          >
            {sectionTag}
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'Boldonse, serif',
            fontSize: isHero ? 40 : isSecondary ? 20 : 16,
            lineHeight: 1.1,
            margin: 0,
            color: 'var(--ink)',
          }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontStyle: 'italic',
              fontSize: isHero ? '1.05rem' : '0.9rem',
              lineHeight: 1.5,
              color: 'var(--ink)',
              margin: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: isHero ? 4 : 2,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            {article.excerpt}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              padding: '2px 6px',
              backgroundColor: platformColor(article.platform),
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {platformLabel(article.platform)}
          </span>
          {article.author_handle && (
            <span
              style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                color: 'var(--gray-mid)',
              }}
            >
              {article.author_handle}
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              color: 'var(--gray-mid)',
            }}
          >
            {timeAgo(article.published_at)}
          </span>
        </div>
      </div>
      </div>

        {/* Rating row — outside clickable area so stars don't navigate */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: isHero ? '0 16px 16px' : '0 12px 12px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <RatingStars
            articleId={article.id}
            initialRating={userRating}
            onRate={handleRate}
          />
          {isAIPick && !promoted && (
            <button
              onClick={handlePromote}
              style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                padding: '3px 8px',
                backgroundColor: promoted ? 'var(--ink)' : 'transparent',
                color: promoted ? 'var(--paper)' : 'var(--ink)',
                border: '1px solid var(--ink)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {promoted ? '✓ ADDED' : '+ ADD TO MY SOURCES'}
            </button>
          )}
          {promoted && (
            <span
              style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                color: 'var(--pink)',
              }}
            >
              ✓ ADDED
            </span>
          )}
        </div>
    </article>
  )
}
