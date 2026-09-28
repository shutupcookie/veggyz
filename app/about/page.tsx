import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { Container, PageHero } from '@/components/site/page-shell'
import { JsonLd } from '@/components/site/json-ld'
import { total } from '@/lib/data'
import { breadcrumbLd, graph, pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'About Veggyz',
  description: 'Veggyz is a free directory of US farmers markets and CSA farms, built on USDA data, plus honest guides to plant-based delivery services.',
  path: '/about/',
})

export default function Page() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }]
  return (
    <>
      <JsonLd data={graph(breadcrumbLd(crumbs))} />
      <PageHero eyebrow="About" title="Veggies, plus a z for zest." lede="Veggyz makes finding real vegetables feel like a treat, not a chore. It is a small, independent site with one job: tell you where the good stuff is, near you, without making you sign up for anything." crumbs={crumbs} />
      <Container className="py-12 md:py-16">
        <div className="prose-veggyz max-w-3xl">
          <h2>What this is</h2>
          <p>
            A directory of {total('farmers-markets').toLocaleString('en-US')} farmers markets and {total('csa').toLocaleString('en-US')} CSA farms across the United States, organized by state and town, with the details that actually matter when you are deciding whether to go: the address, a map link, whether they take SNAP or WIC, what a CSA puts in the box and how long its season runs.
          </p>
          <p>
            Alongside the directory are a handful of guides to plant-based delivery services, for the weeks when a market is not an option. Those guides are where we earn money, and we say so on every one of them.
          </p>
          <h2>Where the data comes from</h2>
          <p>
            Market and farm listings come from the{' '}
            <a href={site.dataSource.url} rel="noopener">{site.dataSource.name}</a>, which markets and farms submit to themselves. We take a fresh copy a few times a year (last: {site.dataSource.snapshot}), clean up addresses, work out which town each listing belongs to, and publish it. We do not invent hours, prices or descriptions; if the directory does not have it, neither do we.
          </p>
          <p>
            Because listings are self-reported, some are stale. Markets move, seasons shift, a farm stops offering shares. If you spot one, email <a href={`mailto:${site.email}`}>{site.email}</a> and we will fix it by hand.
          </p>
          <h2>Three things we care about</h2>
          <p><strong>Where it grew.</strong> Every listing has a location. Most have coordinates, so nearby towns are always one click away.</p>
          <p><strong>Who grew it.</strong> CSA pages show the farm, not a marketing page: what is in the box, how you pay, how long the season is.</p>
          <p><strong>What it costs.</strong> Delivery guides show real per-serving prices with shipping, dated, so you can tell when they have gone stale.</p>
          <h2>Who makes it</h2>
          <p>
            Veggyz is made by one person in their spare time, with a lot of help from public data and a little from software. It runs on a domain that has wanted to be a vegetable site since 2022. Say hello at <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <p>
            Read <Link href="/affiliate-disclosure/">how we make money</Link> and <Link href="/privacy/">what we do with your data</Link> (very little).
          </p>
        </div>
      </Container>
    </>
  )
}
