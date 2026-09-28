import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DirectoryState } from '@/components/site/directory-pages'
import { getDirectory, getState } from '@/lib/data'
import { plural } from '@/lib/format'
import { pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getDirectory('csa').states.map((s) => ({ state: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const s = getState('csa', state)
  if (!s) return {}
  return pageMeta({
    title: `CSA farms in ${s.name}: ${plural(s.count, 'farm')} in ${plural(s.cities, 'town')}`,
    description: `Every CSA farm in ${s.name} listed with the USDA, sorted by town. Seasons, share sizes, what's in the box, and how pickup or delivery works.`,
    path: `/csa/${s.slug}/`,
  })
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const s = getState('csa', state)
  if (!s) notFound()
  return <DirectoryState kind="csa" state={s} />
}
