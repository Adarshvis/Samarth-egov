import React from 'react'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Header from './components/Header'
import Footer from './components/Footer'
import './styles.css'

export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata = {
  description: 'SamarthX — National School Platform',
  title: 'SamarthX',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payload = await getPayload({ config })

  const headerData = await payload.findGlobal({ slug: 'header' as any, depth: 2 })
  const footerData = await payload.findGlobal({ slug: 'footer' as any })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' as any })

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header data={headerData} />
        <main className="flex-1">{children}</main>
        <Footer data={footerData} siteSettings={siteSettings} />
      </body>
    </html>
  )
}
