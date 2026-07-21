// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Lora, Teko } from 'next/font/google'
import { Toaster } from 'sonner'
// @ts-ignore
import '@/app/globals.css'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import ClientOnlyComponents from '../components/client-only-components'

// Lora — Elegant serif for body & headings
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

// Teko — Bold display font 
const teko = Teko({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-teko',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'RCCG Salvation Centre - Redeeming Lives Through Christ',
    template: '%s | RCCG Salvation Centre',
  },
  description: 'Welcome to RCCG Salvation Centre — a vibrant faith community dedicated to worship, spiritual growth, and service.',
  keywords: 'RCCG, Salvation Centre, Church, Christian Worship, Gospel, Faith Community, Redemption, Jesus',
  authors: [{ name: 'RCCG Salvation Centre' }],
  metadataBase: new URL('https://rccgsalvationcentre.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RCCG Salvation Centre',
    description: 'Experience dynamic worship and spiritual growth at RCCG Salvation Centre',
    url: 'https://rccgsalvationcentre.org',
    siteName: 'RCCG Salvation Centre',
    locale: 'en_US',
    type: 'website',
    images: '/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCCG Salvation Centre',
    description: 'Experience dynamic worship and spiritual growth',
    images: '/twitter-image.jpg',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lora.variable} ${teko.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-light text-dark antialiased min-h-screen flex flex-col">
        {/* Sonner Toaster notifications */}
        <Toaster
          position="top-right"
          theme="light"
          richColors
          closeButton
          expand={true}
          toastOptions={{
            classNames: {
              toast: "!bg-light !border !border-gray-200 !shadow-lg !rounded-xl",
              title: "!font-semibold !text-dark",
              description: "!text-muted",
              actionButton: "!bg-dark !text-light hover:!bg-muted",
              cancelButton: "!bg-gray-100 !text-dark hover:!bg-gray-200",
              icon: "!text-dark",
              success: "!border-green-200 !bg-green-50",
              error: "!border-red-200 !bg-red-50",
              warning: "!border-yellow-200 !bg-yellow-50",
              info: "!border-gray-200 !bg-gray-50",
              loading: "!border-gray-200 !bg-gray-50",
            },
            duration: 4000,
          }}
        />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1">
          <div className="relative">
            {/* Background decorative elements */}
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
        <ClientOnlyComponents />
      </body>
    </html>
  )
}