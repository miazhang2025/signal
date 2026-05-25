'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--paper)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Giant watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Boldonse, serif',
          fontSize: 'clamp(120px, 20vw, 240px)',
          color: 'var(--pink)',
          opacity: 0.05,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        SIGNAL
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'var(--paper)',
          border: '2px solid var(--ink)',
          padding: '40px',
        }}
      >
        {/* Pink shadow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'translate(8px, 8px)',
            backgroundColor: 'var(--pink)',
            zIndex: -1,
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: 'Boldonse, serif',
              fontSize: 48,
              lineHeight: 1,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            SIGNAL
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: 'var(--gray-mid)',
              marginTop: 8,
            }}
          >
            your personalized intelligence briefing
          </p>
          <div
            style={{
              width: '100%',
              height: 2,
              backgroundColor: 'var(--ink)',
              margin: '16px 0 0',
            }}
          />
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'Boldonse, serif',
                fontSize: '2rem',
                color: 'var(--pink)',
                marginBottom: 12,
              }}
            >
              ✓
            </div>
            <p style={{ fontFamily: 'var(--font-crimson), serif', fontSize: '1.05rem' }}>
              Check your email for a magic link to sign in.
            </p>
            <p style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.65rem', color: 'var(--gray-mid)', marginTop: 8 }}>
              {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-mid)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--paper)',
                  border: '1px solid var(--ink)',
                  color: 'var(--ink)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.7rem',
                  color: 'var(--pink)',
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: 'Boldonse, serif',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                backgroundColor: 'var(--pink)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {loading ? 'SENDING...' : 'GET MAGIC LINK →'}
            </button>

            <p
              style={{
                fontFamily: 'var(--font-crimson), serif',
                fontStyle: 'italic',
                fontSize: '0.8rem',
                color: 'var(--gray-mid)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              No password required. We&apos;ll email you a one-click sign-in link.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
