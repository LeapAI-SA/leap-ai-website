import type { Viewport } from 'next'
import { Tajawal, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/app-providers'
import {
  getGtmId,
  GoogleTagManagerHead,
  GoogleTagManagerNoscript,
} from '@/components/analytics/google-tag-manager'
import { JsonLd } from '@/components/seo/json-ld'
import { getNavContent, staticNavContent } from '@/lib/cms'
import { fetchPublicSettings } from '@/lib/api'
import { buildRootMetadata, buildWebsiteSchema } from '@/lib/seo'
import { getRequestLocale } from '@/lib/locale'
import { buildEnhancedOrganizationSchema, buildSoftwareApplicationSchema, buildCorporationSchema } from '@/lib/geo'
import './globals.css'

const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata() {
  const [settings, locale] = await Promise.all([fetchPublicSettings(), getRequestLocale()])
  return buildRootMetadata(settings, locale)
}

export const viewport: Viewport = {
  themeColor: '#0066b2',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [settings, nav, locale] = await Promise.all([
    fetchPublicSettings(),
    getNavContent().catch(() => staticNavContent),
    getRequestLocale(),
  ])

  const organizationSchema = buildEnhancedOrganizationSchema(settings ?? undefined)
  const websiteSchema = buildWebsiteSchema()
  const softwareSchema = buildSoftwareApplicationSchema(settings ?? undefined)
  const corporationSchema = buildCorporationSchema(settings ?? undefined)

  const globalGeoSchemas = [organizationSchema, websiteSchema, softwareSchema, corporationSchema]
  const gtmId = getGtmId()

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${tajawal.variable} ${geistMono.variable} bg-background`}
    >
      <head>
        <GoogleTagManagerHead id={gtmId} />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <GoogleTagManagerNoscript id={gtmId} />
        <JsonLd data={globalGeoSchemas} />
        <AppProviders initialSettings={settings} nav={nav} locale={locale}>{children}</AppProviders>
      </body>
    </html>
  )
}
