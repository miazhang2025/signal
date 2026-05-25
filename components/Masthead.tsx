import { format } from 'date-fns'

export default function Masthead() {
  const today = new Date()
  const edition = `VOL. 1 NO. ${Math.floor((today.getTime() - new Date('2024-01-01').getTime()) / 86400000)}`
  const dateStr = format(today, 'EEEE, MMMM d, yyyy').toUpperCase()

  return (
    <header
      style={{
        position: 'relative',
        borderBottom: '6px solid var(--ink)',
        padding: '16px 24px 12px',
        overflow: 'hidden',
        backgroundColor: 'var(--paper)',
      }}
    >
      {/* Faded watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Boldonse, serif',
          fontSize: 'clamp(80px, 14vw, 160px)',
          color: 'var(--pink)',
          opacity: 0.07,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        SIGNAL
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'end', position: 'relative', zIndex: 1 }}>
        {/* Left meta */}
        <div style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--gray-mid)' }}>
          <div>{dateStr}</div>
          <div style={{ marginTop: 2 }}>{edition}</div>
          <div style={{ marginTop: 2 }}>FREE DAILY EDITION</div>
        </div>

        {/* Center title */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'Boldonse, serif',
              fontSize: 'clamp(48px, 8vw, 72px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            SIGNAL
          </h1>
          <div
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: 'var(--gray-mid)',
              marginTop: 2,
            }}
          >
            your personalized intelligence briefing
          </div>
        </div>

        {/* Right edition info */}
        <div
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'var(--gray-mid)',
            textAlign: 'right',
          }}
        >
          <div>AI · TECH · DESIGN</div>
          <div style={{ marginTop: 2 }}>EST. 2024</div>
          <div
            style={{
              marginTop: 4,
              display: 'inline-block',
              backgroundColor: 'var(--pink)',
              color: '#fff',
              padding: '2px 8px',
              fontWeight: 700,
              fontSize: '0.6rem',
            }}
          >
            LIVE
          </div>
        </div>
      </div>
    </header>
  )
}
