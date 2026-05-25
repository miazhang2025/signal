'use client'

import { Article } from '@/types'

interface TickerStripProps {
  articles: Article[]
}

export default function TickerStrip({ articles }: TickerStripProps) {
  const headlines = articles.length > 0
    ? articles.map((a) => a.title).join('  ·  ')
    : 'Signal is curating your personalized news feed  ·  AI-powered curation  ·  Add sources to get started  ·  Rate articles to improve your feed'

  // Duplicate for seamless loop
  const content = `${headlines}  ·  ${headlines}`

  return (
    <div
      style={{
        backgroundColor: 'var(--pink)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        height: 36,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          backgroundColor: 'var(--ink)',
          color: 'var(--paper)',
          padding: '0 12px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          textTransform: 'uppercase',
        }}
      >
        BREAKING
      </span>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div className="ticker-inner">
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: '#fff',
              textTransform: 'uppercase',
              padding: '0 24px',
              whiteSpace: 'nowrap',
            }}
          >
            {content}
          </span>
        </div>
      </div>
    </div>
  )
}
