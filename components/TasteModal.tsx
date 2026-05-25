'use client'

import { useState, useEffect } from 'react'
import { TasteProfile } from '@/types'

interface TasteModalProps {
  onClose: () => void
}

const ALL_TOPICS = [
  'AI Trends', 'Creative Tech', 'Tech Art', 'Generative Design',
  'Real-Time Graphics', 'Tools & Pipelines', 'Machine Learning',
  'Diffusion Models', 'LLMs', 'Robotics', 'Ethics & Policy',
  'Research Papers', 'Open Source', 'Startups', 'Product Launches',
  'Computer Vision', 'Audio AI', '3D Generation', 'NeRF / Gaussian Splatting',
]

export default function TasteModal({ onClose }: TasteModalProps) {
  const [profile, setProfile] = useState<TasteProfile[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ today: 0, ratedWeek: 0, sourcesActive: 0 })

  useEffect(() => {
    async function load() {
      const [tasteRes, sourcesRes] = await Promise.all([
        fetch('/api/taste'),
        fetch('/api/sources'),
      ])
      const taste: TasteProfile[] = await tasteRes.json()
      const sources = await sourcesRes.json()
      setProfile(taste)
      setActiveTags(taste.map((t) => t.category))
      setStats((s) => ({ ...s, sourcesActive: Array.isArray(sources) ? sources.length : 0 }))
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const preferences = activeTags.map((category) => {
      const existing = profile.find((p) => p.category === category)
      return { category, score: existing?.score ?? 5 }
    })
    await fetch('/api/taste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences }),
    })
    setSaving(false)
    onClose()
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const topCategories = [...profile].sort((a, b) => b.score - a.score).slice(0, 6)

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'Boldonse, serif', fontSize: '1.4rem', margin: 0, letterSpacing: '-0.02em' }}>
              MY TASTE
            </h2>
            <p style={{ fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--gray-mid)', margin: '4px 0 0' }}>
              Derived from your reading + rating history
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: 4 }}>
            ×
          </button>
        </div>

        {/* Interest bars */}
        {topCategories.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--gray-mid)', textTransform: 'uppercase', marginBottom: 10 }}>
              INTEREST PROFILE
            </div>
            {topCategories.map((item) => (
              <div key={item.category} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.65rem' }}>{item.category}</span>
                  <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.65rem', color: 'var(--pink)' }}>
                    {Math.round((item.score / 10) * 100)}%
                  </span>
                </div>
                <div style={{ height: 4, backgroundColor: 'var(--gray-light)', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      backgroundColor: 'var(--pink)',
                      width: `${(item.score / 10) * 100}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Topic tags */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--gray-mid)', textTransform: 'uppercase', marginBottom: 10 }}>
            TOPIC PREFERENCES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ALL_TOPICS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`pref-pill ${activeTags.includes(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Activity stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'STORIES TODAY', value: stats.today },
            { label: 'RATED THIS WEEK', value: stats.ratedWeek },
            { label: 'SOURCES ACTIVE', value: stats.sourcesActive },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                border: '1px solid var(--gray-light)',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'Boldonse, serif', fontSize: '1.8rem', color: 'var(--pink)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--gray-mid)', marginTop: 4, textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            fontFamily: 'Boldonse, serif',
            fontSize: '0.85rem',
            letterSpacing: '1px',
            backgroundColor: 'var(--pink)',
            color: '#fff',
            border: 'none',
            padding: '12px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'SAVING...' : 'SAVE PREFERENCES →'}
        </button>
      </div>
    </div>
  )
}
