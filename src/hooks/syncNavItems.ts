import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

async function syncNavToHeader(payload: any) {
  const pages = await payload.find({
    collection: 'pages',
    where: {
      showInNav: { equals: true },
      status: { equals: 'published' },
    },
    overrideAccess: true,
    depth: 2,
    limit: 100,
    sort: ['navOrder', 'createdAt'], // secondary sort ensures stable order even when navOrder is equal
  })

  // Collect every page ID that is referenced as a navChild of some other page
  const childPageIds = new Set<string>()
  for (const page of pages.docs) {
    const rawChildren: any[] = page.navChildren || []
    for (const item of rawChildren) {
      const relatedId = typeof item.page === 'object' ? item.page?.id : item.page
      if (relatedId) childPageIds.add(String(relatedId))
    }
  }

  // Only top-level pages (not referenced as a child anywhere)
  const topLevelPages = pages.docs.filter((p: any) => !childPageIds.has(String(p.id)))

  const navItems = topLevelPages.map((page: any) => {
    const rawChildren: any[] = page.navChildren || []

    const resolvedChildren = rawChildren
      .map((item: any) => {
        const related = typeof item.page === 'object' ? item.page : null
        if (!related) return null
        // Store as { page: { slug, title } } so Header can build the URL from child.page.slug
        return {
          label: item.label || related.title,
          page: {
            slug: related.slug,
            title: related.title,
          },
        }
      })
      .filter(Boolean)

    if (resolvedChildren.length > 0) {
      return {
        label: page.title,
        children: resolvedChildren,
      }
    }

    return {
      label: page.title,
      url: page.slug === 'home' ? '/' : `/${page.slug}`,
    }
  })

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
