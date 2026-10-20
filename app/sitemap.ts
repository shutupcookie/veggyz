import type { MetadataRoute } from 'next'
import { getDirectory } from '@/lib/data'
import { guides } from '@/content/guides'
import { collections, recipePath, recipes, recipesUpdated } from '@/content/recipes'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url
  const lastModified = new Date(site.dataSource.snapshot)
  const out: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/farmers-markets/`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/csa/`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/best/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about/`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/affiliate-disclosure/`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy/`, lastModified, changeFrequency: 'yearly', priority: 0.1 },
  ]
  const recipesDate = new Date(recipesUpdated)
  out.push({ url: `${base}/recipes/`, lastModified: recipesDate, changeFrequency: 'weekly', priority: 0.9 })
  for (const c of collections) out.push({ url: `${base}/recipes/${c.slug}/`, lastModified: recipesDate, changeFrequency: 'weekly', priority: 0.8 })
  for (const r of recipes) out.push({ url: `${base}${recipePath(r)}`, lastModified: recipesDate, changeFrequency: 'monthly', priority: 0.7 })
  for (const g of guides) out.push({ url: `${base}/best/${g.slug}/`, lastModified: new Date(g.checked), changeFrequency: 'monthly', priority: 0.8 })
  for (const kind of ['farmers-markets', 'csa'] as const) {
    const d = getDirectory(kind)
    for (const s of d.states) out.push({ url: `${base}/${kind}/${s.slug}/`, lastModified, changeFrequency: 'monthly', priority: 0.7 })
    for (const c of d.cities) out.push({ url: `${base}/${kind}/${c.stateSlug}/${c.slug}/`, lastModified, changeFrequency: 'monthly', priority: c.count > 2 ? 0.6 : 0.5 })
    if (kind === 'csa') for (const l of d.listings) out.push({ url: `${base}/csa/${l.stateSlug}/${l.citySlug}/${l.slug}/`, lastModified, changeFrequency: 'yearly', priority: 0.4 })
  }
  return out
}
