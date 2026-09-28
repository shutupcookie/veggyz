import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { CsaCard, csaPath } from '@/components/site/csa-card'
import { CityList } from '@/components/site/directory-nav'
import { JsonLd } from '@/components/site/json-ld'
import { getCity, getDirectory, getListingsForCity, getState, type CsaListing } from '@/lib/data'
import { joinNatural, plural } from '@/lib/format'
import { absolute, breadcrumbLd, graph, itemListLd, pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getDirectory('csa').cities.map((c) => ({ state: c.stateSlug, city: c.slug }))
}

function describe(name: string, st: string, ls: CsaListing[]) {
  const n = ls.length
  const seasons = ls.map((l) => l.season).filter(Boolean)
  const base = n === 1
    ? `${ls[0].name} runs a CSA in ${name}, ${st}.`
    : `${plural(n, 'farm')} around ${name}, ${st} sell CSA shares.`
  const s = seasons.length ? ` Seasons run ${joinNatural([...new Set(seasons as string[])].slice(0, 2)).toLowerCase()}.` : ''
  return base + s + ' Share sizes, what goes in the box, and pickup or delivery details for each farm.'
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state, city } = await params
  const c = getCity('csa', state, city)
  if (!c) return {}
  const ls = getListingsForCity('csa', c.state, c.slug) as CsaListing[]
  return pageMeta({
    title: `CSA farms in ${c.name}, ${c.state}${ls.length > 1 ? ` (${ls.length})` : ''}`,
    description: describe(c.name, c.state, ls),
    path: `/csa/${c.stateSlug}/${c.slug}/`,
  })
}

export default async function Page({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params
  const c = getCity('csa', state, city)
  if (!c) notFound()
  const st = getState('csa', state)!
  const ls = getListingsForCity('csa', c.state, c.slug) as CsaListing[]
  const url = `/csa/${c.stateSlug}/${c.slug}/`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'CSA farms', path: '/csa/' },
    { name: st.name, path: `/csa/${st.slug}/` },
    { name: c.name, path: url },
  ]
  const marketCity = getCity('farmers-markets', c.stateSlug, c.slug)
  const ld = graph(
    breadcrumbLd(crumbs),
    itemListLd(`CSA farms in ${c.name}, ${c.state}`, ls.map((l) => ({ name: l.name, url: absolute(csaPath(l)) }))),
  )
  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={`${st.name} · ${c.county ? `${c.county} County` : 'CSA farms'}`}
        title={`CSA farms in ${c.name}, ${c.state}`}
        lede={describe(c.name, c.state, ls)}
        crumbs={crumbs}
      />
      <Container className="py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {ls.map((l) => (
            <CsaCard key={l.id} l={l} />
          ))}
        </div>
      </Container>
      <section className="border-y border-border bg-surface">
        <Container className="py-10 md:py-14">
          {c.nearby.length > 0 && (
            <>
              <SectionTitle sub={`Other towns near ${c.name} with CSA farms, closest first.`}>More CSA farms nearby</SectionTitle>
              <CityList kind="csa" cities={c.nearby} />
            </>
          )}
          {marketCity && (
            <p className="mt-8 text-sm">
              <Link href={`/farmers-markets/${c.stateSlug}/${c.slug}/`} className="inline-flex items-center gap-1 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
                {plural(marketCity.count, 'farmers market')} in {c.name} <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </p>
          )}
        </Container>
      </section>
      <Container className="py-10 md:py-14">
        <div className="prose-veggyz max-w-3xl">
          <h2>How a CSA works</h2>
          <p>
            You buy a share before the season starts, which gives the farm cash when it needs it most, and in return you get a box of whatever&rsquo;s ready each week. Boxes vary with the weather: a wet June means more greens, a hot August means a lot of tomatoes. Most farms in {c.name} offer more than one share size, and several take payment in instalments or SNAP.
          </p>
          <p>
            Details here are what each farm told the USDA. Prices aren&rsquo;t in the directory, so check with the farm directly before you commit.
          </p>
        </div>
      </Container>
    </>
  )
}
