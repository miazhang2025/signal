'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'magic' | 'password'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleOAuth(provider: 'google' | 'github') {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const fn = isSignUp
      ? supabase.auth.signUp({ email: email.trim(), password })
      : supabase.auth.signInWithPassword({ email: email.trim(), password })
    const { error } = await fn
    if (error) setError(error.message)
    else if (isSignUp) setSent(true)
    else window.location.href = '/'
    setLoading(false)
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontFamily: 'var(--font-space-mono), monospace',
    fontSize: '0.8rem',
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--ink)',
    color: 'var(--ink)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const btnPrimary: React.CSSProperties = {
    fontFamily: 'Boldonse, serif',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    backgroundColor: 'var(--pink)',
    color: '#fff',
    border: 'none',
    padding: '12px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    width: '100%',
  }

  const btnOutline: React.CSSProperties = {
    fontFamily: 'var(--font-space-mono), monospace',
    fontSize: '0.72rem',
    backgroundColor: 'var(--paper)',
    color: 'var(--ink)',
    border: '1.5px solid var(--ink)',
    padding: '10px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'translate(8px, 8px)',
            backgroundColor: 'var(--pink)',
            zIndex: -1,
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
          <div style={{ width: '100%', height: 2, backgroundColor: 'var(--ink)', margin: '16px 0 0' }} />
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Boldonse, serif', fontSize: '2rem', color: 'var(--pink)', marginBottom: 12 }}>✓</div>
            <p style={{ fontFamily: 'var(--font-crimson), serif', fontSize: '1.05rem' }}>
              {isSignUp ? 'Account created! Check your email to confirm.' : 'Check your email for a magic link.'}
            </p>
            <p style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.65rem', color: 'var(--gray-mid)', marginTop: 8 }}>
              {email}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* OAuth buttons */}
            <button style={btnOutline} onClick={() => handleOAuth('google')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button style={btnOutline} onClick={() => handleOAuth('github')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              Continue with GitHub
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--gray-mid)', opacity: 0.4 }} />
              <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.6rem', color: 'var(--gray-mid)' }}>OR</span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--gray-mid)', opacity: 0.4 }} />
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', border: '1px solid var(--ink)' }}>
              {(['password', 'magic'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.62rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRight: m === 'password' ? '1px solid var(--ink)' : 'none',
                    backgroundColor: mode === m ? 'var(--ink)' : 'var(--paper)',
                    color: mode === m ? 'var(--paper)' : 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  {m === 'password' ? 'Password' : 'Magic Link'}
                </button>
              ))}
            </div>

            {mode === 'password' ? (
              <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={inputStyle} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" required style={inputStyle} />
                {error && <p style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.7rem', color: 'var(--pink)', margin: 0 }}>{error}</p>}
                <button type="submit" disabled={loading} style={btnPrimary}>
                  {loading ? 'LOADING...' : isSignUp ? 'CREATE ACCOUNT →' : 'SIGN IN →'}
                </button>
                <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                  style={{ fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--gray-mid)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={inputStyle} />
                {error && <p style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.7rem', color: 'var(--pink)', margin: 0 }}>{error}</p>}
                <button type="submit" disabled={loading} style={btnPrimary}>
                  {loading ? 'SENDING...' : 'GET MAGIC LINK →'}
                </button>
              </form>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
