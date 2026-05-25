'use client'

import { useState } from 'react'
import { Platform, FocusArea, Source } from '@/types'

interface SourcesModalProps {
  onClose: () => void
  onAdd: (source: Source) => void
}

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'rss', label: 'Newsletter / RSS' },
  { value: 'blog', label: 'Blog / Website' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'arxiv', label: 'arXiv / Research' },
  { value: 'news', label: 'News Search' },
]

const FOCUS_AREAS: FocusArea[] = [
  'AI Trends',
  'Creative Tech',
  'Tech Art',
  'Generative Design',
  'Real-Time Graphics',
  'Tools & Pipelines',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontFamily: 'var(--font-space-mono), monospace',
  fontSize: '0.75rem',
  backgroundColor: 'var(--paper)',
  border: '1px solid var(--ink)',
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-space-mono), monospace',
  fontSize: '0.65rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--gray-mid)',
  display: 'block',
  marginBottom: 4,
}

export default function SourcesModal({ onClose, onAdd }: SourcesModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState<Platform>('blog')
  const [focusArea, setFocusArea] = useState<FocusArea>('AI Trends')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !url.trim()) {
      setError('Name and URL are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), url: url.trim(), platform, focus_area: focusArea }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const newSource: Source = await res.json()
      onAdd(newSource)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add source')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2
              style={{
                fontFamily: 'Boldonse, serif',
                fontSize: '1.4rem',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              ADD SOURCE
            </h2>
            <p style={{ fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--gray-mid)', margin: '4px 0 0' }}>
              Add a feed to your personalized newspaper
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: 4 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Source Name</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Gradient"
            />
          </div>

          <div>
            <label style={labelStyle}>URL or Handle</label>
            <input
              style={inputStyle}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://thegradient.pub/feed or @username"
            />
          </div>

          <div>
            <label style={labelStyle}>Platform</label>
            <select
              style={inputStyle}
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Focus Area</label>
            <select
              style={inputStyle}
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value as FocusArea)}
            >
              {FOCUS_AREAS.map((fa) => (
                <option key={fa} value={fa}>{fa}</option>
              ))}
            </select>
          </div>

          {error && (
            <p style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.7rem', color: 'var(--pink)', margin: 0 }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                fontFamily: 'Boldonse, serif',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                backgroundColor: 'var(--pink)',
                color: '#fff',
                border: 'none',
                padding: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'ADDING...' : 'ADD SOURCE →'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontFamily: 'Boldonse, serif',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                backgroundColor: 'transparent',
                color: 'var(--ink)',
                border: '1px solid var(--ink)',
                padding: '10px 16px',
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
