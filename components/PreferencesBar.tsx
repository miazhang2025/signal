'use client'

import { useState } from 'react'

const ALL_TAGS = [
  'AI TRENDS', 'CREATIVE TECH', 'TECH ART', 'GENERATIVE DESIGN',
  'REAL-TIME GRAPHICS', 'TOOLS & PIPELINES', 'MACHINE LEARNING',
  'DIFFUSION MODELS', 'LLMs', 'ROBOTICS', 'ETHICS & POLICY',
  'RESEARCH PAPERS', 'OPEN SOURCE', 'STARTUPS', 'PRODUCT LAUNCHES',
]

interface PreferencesBarProps {
  active?: string[]
  onChange?: (tags: string[]) => void
}

export default function PreferencesBar({ active = [], onChange }: PreferencesBarProps) {
  const [activeTags, setActiveTags] = useState<string[]>(active)

  function toggle(tag: string) {
    const next = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag]
    setActiveTags(next)
    onChange?.(next)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--pink-pale)',
        padding: '8px 24px',
        borderBottom: '1px solid var(--gray-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.12em',
          color: 'var(--gray-mid)',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        FILTER:
      </span>
      {ALL_TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={`pref-pill ${activeTags.includes(tag) ? 'active' : ''}`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
