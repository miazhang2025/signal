'use client'

import { useState } from 'react'
import { Article, Source } from '@/types'
import { timeAgo, platformLabel } from '@/lib/utils'

interface SidebarProps {
  sources: Source[]
  trendingArticles: Article[]
  onRemoveSource?: (id: string) => void
  onPromoteSource?: (id: string) => void
}

export default function Sidebar({ sources, trendingArticles, onRemoveSource, onPromoteSource }: SidebarProps) {
  const [localSources, setLocalSources] = useState(sources)

  async function handleRemove(id: string) {
    await fetch(`/api/sources/${id}`, { method: 'DELETE' })
    setLocalSources((prev) => prev.filter((s) => s.id !== id))
    onRemoveSource?.(id)
  }

  async function handlePromote(id: string) {
    await fetch(`/api/sources/${id}/promote`, { method: 'POST' })
    setLocalSources((prev) =>
      prev.map((s) => s.id === id ? { ...s, is_ai_pick: false, is_promoted: true } : s)
    )
    onPromoteSource?.(id)
  }

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Your Sources */}
      <section style={{ borderBottom: '1px solid var(--gray-light)' }}>
        <div
          style={{
            backgroundColor: 'var(--pink)',
            padding: '8px 16px',
          }}
        >
          <h3
            style={{
              fontFamily: 'Boldonse, serif',
              fontSize: '0.8rem',
              letterSpacing: '2px',
              color: '#fff',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            YOUR SOURCES
          </h3>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {localSources.length === 0 && (
            <p style={{ fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--gray-mid)', margin: 0 }}>
              No sources yet. Add some to get started.
            </p>
          )}
          {localSources.map((source) => (
            <div
              key={source.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: source.is_ai_pick && !source.is_promoted ? 'var(--ink)' : 'var(--pink)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {source.name}
                </div>
                <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.55rem', color: 'var(--gray-mid)' }}>
                  {platformLabel(source.platform)}
                  {source.focus_area && ` · ${source.focus_area}`}
                </div>
              </div>
              {source.is_ai_pick && !source.is_promoted && (
                <button
                  onClick={() => handlePromote(source.id)}
                  style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.55rem',
                    padding: '2px 5px',
                    background: 'transparent',
                    border: '1px solid var(--pink)',
                    color: 'var(--pink)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  + ADD
                </button>
              )}
              <button
                onClick={() => handleRemove(source.id)}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.65rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gray-mid)',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  flexShrink: 0,
                }}
                aria-label="Remove source"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <div
          style={{
            backgroundColor: 'var(--ink)',
            padding: '8px 16px',
          }}
        >
          <h3
            style={{
              fontFamily: 'Boldonse, serif',
              fontSize: '0.8rem',
              letterSpacing: '2px',
              color: 'var(--paper)',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            TRENDING NOW
          </h3>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {trendingArticles.length === 0 && (
            <p style={{ fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--gray-mid)', margin: 0 }}>
              No trending stories yet.
            </p>
          )}
          {trendingArticles.slice(0, 8).map((article, i) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                gap: 10,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <span
                style={{
                  fontFamily: 'Boldonse, serif',
                  fontSize: '1.2rem',
                  color: 'var(--pink)',
                  lineHeight: 1,
                  flexShrink: 0,
                  width: 20,
                }}
              >
                {i + 1}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-crimson), serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: 'var(--ink)',
                  }}
                >
                  {article.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.55rem',
                    color: 'var(--gray-mid)',
                    marginTop: 2,
                  }}
                >
                  {timeAgo(article.published_at)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </aside>
  )
}
