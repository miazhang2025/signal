'use client'

import { useState } from 'react'

interface RatingStarsProps {
  articleId: string
  initialRating?: number
  onRate?: (stars: number) => void
  label?: string
}

export default function RatingStars({ articleId, initialRating = 0, onRate, label }: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [saving, setSaving] = useState(false)

  async function handleRate(stars: number) {
    if (saving) return
    setSaving(true)
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, stars }),
      })
      setRating(stars)
      onRate?.(stars)
    } finally {
      setSaving(false)
    }
  }

  const frontPageLabel = rating >= 5 ? 'FRONT PAGE' : rating >= 4 ? 'RECOMMENDED' : rating >= 3 ? 'NOTED' : null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          className={`star-btn ${(hover || rating) >= s ? 'filled' : ''}`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleRate(s)}
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
          disabled={saving}
        >
          ★
        </button>
      ))}
      {(label ?? frontPageLabel) && (
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: 'var(--pink)',
            textTransform: 'uppercase',
          }}
        >
          {label ?? frontPageLabel}
        </span>
      )}
    </div>
  )
}
