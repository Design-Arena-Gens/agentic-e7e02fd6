import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reality Show Video Finder',
  description: 'AI-powered reality show video finder from specific YouTube channels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
