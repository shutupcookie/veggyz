import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { Badge } from '@/components/site/badge'
import { CsaCard, csaPath } from '@/components/site/csa-card'
import { JsonLd } from '@/components/site/json-ld'
import { getCity, getDirectory, getListing, getState, nearbyListings, type CsaListing } from '@/lib/data'
import { formatDate, joinNatural, mapsUrl, tidy, truncate } from '@/lib/format'
import { absolute, breadcrumbLd, csaLd, graph, pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return getDirectory('csa').listings.map((l) => ({ state: l.stateSlug, city: l.citySlug, slug: l.slug }))
}

function summary(l: CsaListing) {
  const parts: string[] = []
  parts.push(`${l.name} is a CSA farm in ${l.city}, ${l.state}`)
  if (l.season) parts[0] += ` with a ${l.season} season`
  parts[0] += '.'
  if (l.vegetables.length) parts.push(`Boxes include ${joinNatural(l.vegetables.slice(0, 5).map((v) => v.replace(/\s*\(.*?\)/g, '').toLowerCase()))}${l.vegetables.length > 5 ? ' and more' : ''}.`)
  if (l.shareSizes.length) parts.push(`Shares: ${joinNatural(l.shareSizes.map((s) => s.toLowerCase()))}.`)
  if (l.pickup.length) parts.push(`${l.pickup[0].replace(/;$/, '')}.`)
  if (parts.join(' ').length < 90) parts.push('Listed in the USDA CSA Directory, with the farm address, a map link and other CSA farms nearby.')
  return truncate(parts.join(' '), 300)
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string; slug: string }> }): Promise<Metadata> {
  const { state, city, slug } = await params
  const l = getListing('csa', state, city, slug) as CsaListing | null
  if (!l) return {}
  return pageMeta({
    title: `${l.name} — CSA in ${l.city}, ${l.state}`,
    description: summary(l),
    path: csaPath(l),
  })
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold text-beet">{label}</dt>
      <dd className="leading-relaxed">{children}</dd>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ state: string; city: string; slug: string }> }) {
  const { state, city, slug } = await params
  const l = getListing('csa', state, city, slug) as CsaListing | null
  if (!l) notFound()
  const st = getState('csa', state)!
  const c = getCity('csa', state, city)!
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'CSA farms', path: '/csa/' },
    { name: st.name, path: `/csa/${st.slug}/` },
    { name: c.name, path: `/csa/${c.stateSlug}/${c.slug}/` },
    { name: l.name, path: csaPath(l) },
  ]
  const nearby = nearbyListings<CsaListing>('csa', l, 4, 50)
  const desc = tidy(l.description)
  const organic = l.production.some((p) => /organic/i.test(p))
  const ld = graph(breadcrumbLd(crumbs), csaLd(l, absolute(csaPath(l))))

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={`CSA farm · ${l.city}, ${l.state}`}
        title={l.name}
        lede={summary(l)}
        crumbs={crumbs}
        aside={
          <div className="flex flex-wrap gap-2 md:justify-end">
            {l.snap && <Badge tone="lime">SNAP / EBT</Badge>}
            {organic && <Badge tone="lime">Organic</Badge>}
            {l.season && <Badge tone="outline">{l.season}</Badge>}
          </div>
        }
      />
      <Container className="py-10 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            {desc && <p className="text-lg leading-relaxed text-pretty">{desc}</p>}
            <dl className="mt-6 border-t border-border">
              {l.address && (
                <Row label="Farm address">
                  <span className="flex items-start gap-2">
                    <MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span>
                      {l.address}
                      <br />
                      <a href={mapsUrl(l)} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-sm font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
                        Open in Google Maps <ExternalLink className="size-3" aria-hidden />
                      </a>
                    </span>
                  </span>
                </Row>
              )}
              {l.locationNote && <Row label="Where to find it">{tidy(l.locationNote)}</Row>}
              {(l.season || l.seasonWeeks) && (
                <Row label="Season">
                  {l.season}
                  {l.seasonWeeks ? `${l.season ? ' · ' : ''}${l.seasonWeeks} weeks` : ''}
                  {l.seasonNote ? <span className="mt-1 block text-sm text-muted-foreground">{tidy(l.seasonNote)}</span> : null}
                </Row>
              )}
              {l.vegetables.length > 0 && <Row label="Vegetables">{l.vegetables.join(', ')}</Row>}
              {l.fruit.length > 0 && <Row label="Fruit">{l.fruit.join(', ')}</Row>}
              {l.otherProducts.length > 0 && <Row label="Also in the box">{l.otherProducts.join(' · ')}</Row>}
              {l.shareSizes.length > 0 && <Row label="Share sizes">{l.shareSizes.join(', ')}</Row>}
              {l.shareContents && <Row label="Who picks the box">{tidy(l.shareContents)}</Row>}
              {l.shareCount != null && l.shareCount > 0 && <Row label="Shares offered">{l.shareCount.toLocaleString('en-US')} per season</Row>}
              {l.paymentPlan.length > 0 && <Row label="How you pay">{l.paymentPlan.join(' · ')}</Row>}
              {l.payment.length > 0 && <Row label="Payment types">{l.payment.join(', ')}{l.snap ? ' · SNAP/EBT' : ''}</Row>}
              {l.pickup.length > 0 && <Row label="Pickup or delivery">{l.pickup.join(' · ')}</Row>}
              {l.production.length > 0 && <Row label="Growing practices">{l.production.join(', ')}</Row>}
              {(l.farms != null || l.yearsOperating) && (
                <Row label="The farm">
                  {[l.farms != null && l.farms > 0 ? `${l.farms === 1 ? 'Single farm' : `${l.farms} farms supply this CSA`}` : null, l.yearsOperating ? `running ${l.yearsOperating}` : null]
                    .filter(Boolean)
                    .join(' · ')}
                </Row>
              )}
            </dl>
            <p className="mt-6 text-sm text-muted-foreground">
              Listing as reported to the {site.dataSource.name}
              {l.updatedAt ? `, last updated ${formatDate(l.updatedAt)}` : ''}. Prices and sign-up windows aren&rsquo;t in the directory; contact the farm. Run this CSA and want to update it? Email {site.email}.
            </p>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-beet p-6 text-husk">
              <h2 className="font-display text-xl font-bold text-lime">Before you sign up</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-husk/85">
                <li>Ask what a typical week looks like in the month you&rsquo;d start.</li>
                <li>Check the pickup window fits your week; missed boxes usually aren&rsquo;t refunded.</li>
                <li>Half shares are plenty for one or two people who cook a few nights a week.</li>
              </ul>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-beet">More in {c.name}</h2>
              <p className="mt-1 text-sm">
                <Link href={`/csa/${c.stateSlug}/${c.slug}/`} className="inline-flex items-center gap-1 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
                  All CSA farms in {c.name} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </p>
              {getCity('farmers-markets', c.stateSlug, c.slug) && (
                <p className="mt-2 text-sm">
                  <Link href={`/farmers-markets/${c.stateSlug}/${c.slug}/`} className="inline-flex items-center gap-1 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
                    Farmers markets in {c.name} <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </p>
              )}
            </div>
          </aside>
        </div>
      </Container>
      {nearby.length > 0 && (
        <section className="border-t border-border bg-surface">
          <Container className="py-10 md:py-14">
            <SectionTitle sub="Other CSA farms within about 50 miles, closest first.">Nearby CSA farms</SectionTitle>
            <div className="grid gap-5 md:grid-cols-2">
              {nearby.map((n) => (
                <CsaCard key={n.id} l={n} mi={n.mi} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
