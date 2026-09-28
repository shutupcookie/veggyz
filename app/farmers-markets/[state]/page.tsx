import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DirectoryState } from '@/components/site/directory-pages'
import { getDirectory, getState } from '@/lib/data'
import { plural } from '@/lib/format'
import { pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getDirectory('farmers-markets').states.map((s) => ({ state: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const s = getState('farmers-markets', state)
  if (!s) return {}
  return pageMeta({
    title: `Farmers markets in ${s.name}: ${plural(s.count, 'market')} in ${plural(s.cities, 'town')}`,
    description: `Every farmers market in ${s.name} listed with the USDA, sorted by town. Addresses, map links, and which markets take SNAP/EBT, WIC and cards.`,
    path: `/farmers-markets/${s.slug}/`,
  })
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const s = getState('farmers-markets', state)
  if (!s) notFound()
  return <DirectoryState kind="farmers-markets" state={s} />
}
