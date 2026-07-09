import { Analytics } from '@vercel/analytics/next'
import type { Viewport } from 'next'
import { Tajawal, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/app-providers'
import { JsonLd } from '@/components/seo/json-ld'
import { getNavContent, staticNavContent } from '@/lib/cms'
import { fetchPublicSettings } from '@/lib/api'
import { buildRootMetadata, buildWebsiteSchema } from '@/lib/seo'
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
  const settings = await fetchPublicSettings()
  return buildRootMetadata(settings)
}

export const viewport: Viewport = {
  themeColor: '#0066b2',
  width: 'device-width',
  initialScale: 1,
}

export const revalidate = 60

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [settings, nav] = await Promise.all([
    fetchPublicSettings(),
    getNavContent().catch(() => staticNavContent),
  ])

  const organizationSchema = buildEnhancedOrganizationSchema(settings ?? undefined)
  const websiteSchema = buildWebsiteSchema()
  const softwareSchema = buildSoftwareApplicationSchema()
  const corporationSchema = buildCorporationSchema(settings ?? undefined)

  const globalGeoSchemas = [organizationSchema, websiteSchema, softwareSchema, corporationSchema]

  return (
    <html
      lang={settings?.defaultLanguage ?? 'ar'}
      dir={(settings?.defaultLanguage ?? 'ar') === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${tajawal.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <JsonLd data={globalGeoSchemas} />
        <AppProviders initialSettings={settings} nav={nav}>{children}</AppProviders>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
