'use client'

interface NavBarProps {
  onOpenTaste: () => void
  onOpenAddSource: () => void
}

const NAV_ITEMS = ['FRONT PAGE', 'AI', 'RESEARCH', 'DESIGN', 'TOOLS', 'COMMUNITY']

export default function NavBar({ onOpenTaste, onOpenAddSource }: NavBarProps) {
  return (
    <nav
      style={{
        backgroundColor: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 0,
        height: 44,
      }}
    >
      {/* Nav items */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            style={{
              fontFamily: 'Boldonse, serif',
              fontSize: '0.7rem',
              letterSpacing: '1.5px',
              color: item === 'FRONT PAGE' ? 'var(--pink)' : 'var(--paper)',
              background: 'transparent',
              border: 'none',
              padding: '0 14px',
              height: 44,
              cursor: 'pointer',
              borderBottom: item === 'FRONT PAGE' ? '3px solid var(--pink)' : '3px solid transparent',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (item !== 'FRONT PAGE') (e.target as HTMLButtonElement).style.color = 'var(--pink)'
            }}
            onMouseLeave={(e) => {
              if (item !== 'FRONT PAGE') (e.target as HTMLButtonElement).style.color = 'var(--paper)'
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={onOpenTaste}
          style={{
            fontFamily: 'Boldonse, serif',
            fontSize: '0.65rem',
            letterSpacing: '1px',
            backgroundColor: 'var(--ink)',
            color: 'var(--pink)',
            border: '1px solid var(--pink)',
            padding: '6px 14px',
            cursor: 'pointer',
            height: 32,
          }}
        >
          MY TASTE ★
        </button>
        <button
          onClick={onOpenAddSource}
          style={{
            fontFamily: 'Boldonse, serif',
            fontSize: '0.65rem',
            letterSpacing: '1px',
            backgroundColor: 'var(--pink)',
            color: '#fff',
            border: '1px solid var(--pink)',
            padding: '6px 14px',
            cursor: 'pointer',
            height: 32,
          }}
        >
          + ADD SOURCE
        </button>
      </div>
    </nav>
  )
}
