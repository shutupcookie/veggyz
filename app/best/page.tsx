import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { ArrowRight } from 'lucide-react'
import { Container, PageHero } from '@/components/site/page-shell'
import { JsonLd } from '@/components/site/json-ld'
import { guides } from '@/content/guides'
import { breadcrumbLd, graph, itemListLd, pageMeta, absolute } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Plant-based delivery guides, compared honestly',
  description:
    'Honest comparisons of vegan meal delivery services, plant-based meal kits, organic produce boxes and meal planning apps, with real prices and the fine print.',
  path: '/best/',
})

export default function Page() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Delivery guides', path: '/best/' }]
  return (
    <>
      <JsonLd data={graph(breadcrumbLd(crumbs), itemListLd('Veggyz delivery guides', guides.map((g) => ({ name: g.title, url: absolute(`/best/${g.slug}/`) }))))} />
      <PageHero
        eyebrow="Delivery guides"
        title="Vegetables, delivered. Compared honestly."
        lede="When the market is closed and the CSA season is over, these are the services worth paying for. Real prices, shipping included, and the catches spelled out. Some links pay us a referral fee; it never changes the verdict."
        crumbs={crumbs}
      />
      <Container className="py-12 md:py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/best/${g.slug}/`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-beet hover:bg-beet hover:text-husk"
              >
                <span className="font-display text-2xl font-bold leading-tight">{g.title}</span>
                <span className="mt-2 text-muted-foreground group-hover:text-husk/75">{g.blurb}</span>
                <span className="mt-auto pt-4 text-sm font-semibold">
                  {g.picks.length} services compared · checked {new Date(g.checked + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                  <ArrowRight className="ml-1 inline size-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          Prefer the real thing?{' '}
          <Link href="/farmers-markets/" className="font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            Find a farmers market
          </Link>{' '}
          or{' '}
          <Link href="/csa/" className="font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            a CSA farm
          </Link>{' '}
          near you. They are cheaper than every service on these pages.
        </p>
      </Container>
    </>
  )
}
