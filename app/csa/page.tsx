import type { Metadata } from 'next'
import { DirectoryIndex } from '@/components/site/directory-pages'
import { total } from '@/lib/data'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'CSA farms near you, by state and city',
  description: `Browse ${total('csa').toLocaleString('en-US')} community-supported agriculture (CSA) farms across the US by state and town: seasons, share sizes, what goes in the box, pickup and delivery. From the USDA CSA Directory.`,
  path: '/csa/',
})

export default function Page() {
  return <DirectoryIndex kind="csa" />
}
