import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        paper: '#f5f0e8',
        pink: '#ff1a6e',
        'pink-pale': '#ffe0ed',
        'gray-mid': '#888888',
        'gray-light': '#ddd8cc',
      },
      fontFamily: {
        display: ['var(--font-boldonse)', 'serif'],
        body: ['var(--font-crimson)', 'Georgia', 'serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '0',
      },
    },
  },
  plugins: [],
}

export default config
