import type { Metadata } from 'next'
import { DirectoryIndex } from '@/components/site/directory-pages'
import { total } from '@/lib/data'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Farmers markets near you, by state and city',
  description: `Browse ${total('farmers-markets').toLocaleString('en-US')} US farmers markets by state and town, with addresses, map links and SNAP/EBT and WIC acceptance. From the USDA National Farmers Market Directory.`,
  path: '/farmers-markets/',
})

export default function Page() {
  return <DirectoryIndex kind="farmers-markets" />
}
