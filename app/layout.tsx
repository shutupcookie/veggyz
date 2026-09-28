import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import localFont from 'next/font/local'
import './globals.css'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { JsonLd } from '@/components/site/json-ld'
import { site } from '@/lib/site'
import { graph, organizationLd, websiteLd } from '@/lib/seo'

// Both families are self-hosted variable fonts (OFL, via fontsource) — no
// request to Google at build or run time.
const bricolage = localFont({
  src: [{ path: './fonts/bricolage-grotesque-latin-wght.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-bricolage',
  display: 'swap',
})

const dmSans = localFont({
  src: [
    { path: './fonts/dm-sans-latin-wght.woff2', weight: '100 1000', style: 'normal' },
    { path: './fonts/dm-sans-latin-wght-italic.woff2', weight: '100 1000', style: 'italic' },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — farmers markets, CSA farms and plant-based delivery, near you`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  openGraph: { siteName: site.name, locale: site.locale, type: 'website' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#5a1236',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} bg-background`}>
      <body className="flex min-h-svh flex-col antialiased">
        <JsonLd data={graph(organizationLd(), websiteLd())} />
        <SiteHeader />
        <div id="main" className="flex-1">
          {children}
        </div>
        <SiteFooter />
        {site.cfBeaconToken && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: site.cfBeaconToken })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
