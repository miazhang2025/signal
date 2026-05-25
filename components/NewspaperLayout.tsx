'use client'

import { useState } from 'react'
import { Article, RankedFeed, Source } from '@/types'
import Masthead from './Masthead'
import NavBar from './NavBar'
import TickerStrip from './TickerStrip'
import PreferencesBar from './PreferencesBar'
import ArticleCard from './ArticleCard'
import Sidebar from './Sidebar'
import SourcesModal from './SourcesModal'
import TasteModal from './TasteModal'

interface NewspaperLayoutProps {
  feed: RankedFeed
  sources: Source[]
}

export default function NewspaperLayout({ feed: initialFeed, sources: initialSources }: NewspaperLayoutProps) {
  const [feed, setFeed] = useState(initialFeed)
  const [sources, setSources] = useState(initialSources)
  const [showTaste, setShowTaste] = useState(false)
  const [showAddSource, setShowAddSource] = useState(false)

  function handleAddSource(newSource: Source) {
    setSources((prev) => [newSource, ...prev])
  }

  const allArticles = [
    ...(feed.hero ? [feed.hero] : []),
    ...feed.secondary,
    ...feed.grid,
    ...feed.sidebar,
  ]

  return (
    <>
      <Masthead />
      <NavBar
        onOpenTaste={() => setShowTaste(true)}
        onOpenAddSource={() => setShowAddSource(true)}
      />
      <TickerStrip articles={allArticles.slice(0, 6)} />
      <PreferencesBar />

      {/* Main newspaper grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr',
          gap: 0,
          maxWidth: 1440,
          margin: '0 auto',
          borderTop: '2px solid var(--ink)',
        }}
      >
        {/* Main content */}
        <main style={{ borderRight: '1px solid var(--gray-light)' }}>
          {/* Hero + secondary row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              borderBottom: '1px solid var(--gray-light)',
              minHeight: 400,
            }}
          >
            {/* Hero */}
            <div style={{ borderRight: '1px solid var(--gray-light)' }}>
              {feed.hero ? (
                <ArticleCard article={feed.hero} variant="hero" />
              ) : (
                <EmptyState message="No stories today — add sources and fetch content to get started." />
              )}
            </div>

            {/* Secondary stack */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {feed.secondary.map((article, i) => (
                <div
                  key={article.id}
                  style={{ flex: 1, borderBottom: i < feed.secondary.length - 1 ? '1px solid var(--gray-light)' : undefined }}
                >
                  <ArticleCard article={article} variant="secondary" />
                </div>
              ))}
              {feed.secondary.length === 0 && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                  <span style={{ fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic', color: 'var(--gray-mid)', fontSize: '0.85rem' }}>
                    More stories will appear here
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section divider */}
          {feed.grid.length > 0 && (
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '2px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: 'Boldonse, serif',
                  fontSize: '0.7rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}
              >
                MORE STORIES
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--gray-light)' }} />
            </div>
          )}

          {/* 3-column grid row 1 */}
          {feed.grid.slice(0, 3).length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                borderBottom: '1px solid var(--gray-light)',
              }}
            >
              {feed.grid.slice(0, 3).map((article, i) => (
                <div
                  key={article.id}
                  style={{ borderRight: i < 2 ? '1px solid var(--gray-light)' : undefined }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}

          {/* 3-column grid row 2 */}
          {feed.grid.slice(3, 6).length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                borderBottom: '1px solid var(--gray-light)',
              }}
            >
              {feed.grid.slice(3, 6).map((article, i) => (
                <div
                  key={article.id}
                  style={{ borderRight: i < 2 ? '1px solid var(--gray-light)' : undefined }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}

          {/* Bottom row */}
          {feed.grid.slice(6, 9).length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {feed.grid.slice(6, 9).map((article, i) => (
                <div
                  key={article.id}
                  style={{ borderRight: i < 2 ? '1px solid var(--gray-light)' : undefined }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <Sidebar
          sources={sources}
          trendingArticles={feed.sidebar}
          onRemoveSource={(id) => setSources((prev) => prev.filter((s) => s.id !== id))}
        />
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'var(--ink)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 0,
        }}
      >
        <span style={{ fontFamily: 'Boldonse, serif', fontSize: '1.2rem', color: 'var(--paper)' }}>
          SIGNAL
        </span>
        <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.6rem', color: 'var(--pink)', letterSpacing: '0.1em' }}>
          POWERED BY CLAUDE · MADE FOR CURIOUS MINDS
        </span>
        <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.6rem', color: 'var(--gray-mid)', letterSpacing: '0.1em' }}>
          © 2024 SIGNAL
        </span>
      </footer>

      {/* Modals */}
      {showTaste && <TasteModal onClose={() => setShowTaste(false)} />}
      {showAddSource && (
        <SourcesModal
          onClose={() => setShowAddSource(false)}
          onAdd={handleAddSource}
        />
      )}
    </>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        gap: 16,
        minHeight: 400,
        border: '2px solid var(--ink)',
      }}
    >
      <div
        style={{
          fontFamily: 'Boldonse, serif',
          fontSize: '4rem',
          color: 'var(--pink)',
          opacity: 0.3,
          lineHeight: 1,
        }}
      >
        SIGNAL
      </div>
      <p
        style={{
          fontFamily: 'var(--font-crimson), serif',
          fontStyle: 'italic',
          fontSize: '1rem',
          color: 'var(--gray-mid)',
          textAlign: 'center',
          maxWidth: 320,
          margin: 0,
        }}
      >
        {message}
      </p>
    </div>
  )
}
