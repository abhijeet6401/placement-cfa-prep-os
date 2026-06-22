import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Placement & CFA Prep OS',
  description: 'Personal dashboard for placement prep and CFA Level 1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  )
}
