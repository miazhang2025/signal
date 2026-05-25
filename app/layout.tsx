/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next'
import { Crimson_Pro, Space_Mono } from 'next/font/google'
import './globals.css'

const crimsonPro = Crimson_Pro({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Signal — Your Personal Newspaper',
  description: 'AI-curated daily news from the sources you trust',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
        {children}
      </body>
    </html>
  )
}
