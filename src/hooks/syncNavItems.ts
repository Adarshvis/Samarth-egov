import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

async function syncNavToHeader(payload: any) {
  // 1. Fetch current header to preserve manual items and submenus
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  const existingNav = header.navItems || []

  // 2. Fetch all pages so we can distinguish between page links and manual external links
  const allPages = await payload.find({ collection: 'pages', limit: 1000, depth: 0 })
  const allPageUrls = new Set(allPages.docs.map((p: any) => p.slug === 'home' ? '/' : `/${p.slug}`))

  // 3. Filter out existing nav items that belong to pages (we will rebuild them). 
  // This leaves behind completely manual/external links so they don't get deleted!
  const manualNavItems = existingNav.filter((item: any) => !allPageUrls.has(item.url))

  // 4. Fetch the pages that SHOULD be in the nav
  const activePages = await payload.find({
    collection: 'pages',
    where: { showInNav: { equals: true }, status: { equals: 'published' } },
    sort: ['navOrder', 'createdAt'],
    limit: 100,
    depth: 0
  })

  // 5. Build the new page links, but PRESERVE their existing `children` submenus
  const pageNavItems = activePages.docs.map((page: any) => {
    const url = page.slug === 'home' ? '/' : `/${page.slug}`
    const previousItem = existingNav.find((item: any) => item.url === url)
    return {
      label: page.title,
      url: url,
      children: previousItem?.children || [], // Keep the submenus the admin built in the Header global!
    }
  })

  // Combine them: Page links first (sorted by navOrder), then any manual links at the end
  const navItems = [...pageNavItems, ...manualNavItems]

  await payload.updateGlobal({
    slug: 'header',
    data: { navItems },
    overrideAccess: true,
  })
}

export const syncNavAfterChange: CollectionAfterChangeHook = async ({ req }) => {
  try {
    await syncNavToHeader(req.payload)
  } catch (err) {
    req.payload.logger.error(`Failed to sync nav after change: ${err}`)
  }
}

export const syncNavAfterDelete: CollectionAfterDeleteHook = async ({ req }) => {
  try {
    await syncNavToHeader(req.payload)
  } catch (err) {
    req.payload.logger.error(`Failed to sync nav after delete: ${err}`)
  }
}
