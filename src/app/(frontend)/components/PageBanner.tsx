import React from 'react'
import Link from 'next/link'

interface PageBannerProps {
  title: string
  slug?: string
}

export default function PageBanner({ title, slug }: PageBannerProps) {
  return (
    <div className="page-banner">
      <div className="page-banner__inner">
        <h1 className="page-banner__title">{title}</h1>
        <nav className="page-banner__breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="page-banner__breadcrumb-link">
            Home
          </Link>
          <span className="page-banner__breadcrumb-sep">/</span>
          <span className="page-banner__breadcrumb-current">{title}</span>
        </nav>
      </div>
    </div>
  )
}
