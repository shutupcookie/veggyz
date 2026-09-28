import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { MarketCard } from '@/components/site/market-card'
import { CityList } from '@/components/site/directory-nav'
import { JsonLd } from '@/components/site/json-ld'
import { sourceNote, urlFor } from '@/components/site/directory-pages'
import { getCity, getDirectory, getListingsForCity, getState } from '@/lib/data'
import { joinNatural, plural } from '@/lib/format'
import { breadcrumbLd, graph, itemListLd, marketLd, pageMeta, faqLd } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getDirectory('farmers-markets').cities.map((c) => ({ state: c.stateSlug, city: c.slug }))
}

function describe(cityName: string, stateAbbr: string, n: number, snap: number) {
  const base = n === 1
    ? `There is one farmers market in ${cityName}, ${stateAbbr} listed with the USDA.`
    : `${cityName}, ${stateAbbr} has ${plural(n, 'farmers market')} listed with the USDA.`
  const s = snap > 0 ? ` ${snap === n ? (n === 1 ? 'It takes' : 'All of them take') : `${snap} of them take`} SNAP/EBT.` : ''
  return base + s + ' Addresses and map links for each, plus nearby towns with markets.'
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state, city } = await params
  const c = getCity('farmers-markets', state, city)
  if (!c) return {}
  const ls = getListingsForCity('farmers-markets', c.state, c.slug)
  const snap = ls.filter((l) => l.snap).length
  return pageMeta({
    title: `Farmers markets in ${c.name}, ${c.state}${ls.length > 1 ? ` (${ls.length})` : ''}`,
    description: describe(c.name, c.state, ls.length, snap),
    path: `/farmers-markets/${c.stateSlug}/${c.slug}/`,
  })
}

export default async function Page({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params
  const c = getCity('farmers-markets', state, city)
  if (!c) notFound()
  const st = getState('farmers-markets', state)!
  const ls = getListingsForCity('farmers-markets', c.state, c.slug)
  const snap = ls.filter((l) => l.snap)
  const wic = ls.filter((l) => l.wic)
  const url = `/farmers-markets/${c.stateSlug}/${c.slug}/`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Farmers markets', path: '/farmers-markets/' },
    { name: st.name, path: `/farmers-markets/${st.slug}/` },
    { name: c.name, path: url },
  ]
  const csaCity = getCity('csa', c.stateSlug, c.slug)
  const nearbyCsa = getDirectory('csa').cities.filter((x) => x.state === c.state && c.nearby.some((n) => n.slug === x.slug)).slice(0, 4)

  const faq = [
    {
      q: `How many farmers markets are there in ${c.name}, ${c.state}?`,
      a: `${plural(ls.length, 'farmers market')} in ${c.name} ${ls.length === 1 ? 'is' : 'are'} listed in the USDA National Farmers Market Directory: ${joinNatural(ls.map((l) => l.name))}.`,
    },
    snap.length > 0
      ? {
          q: `Which farmers markets in ${c.name} accept SNAP/EBT?`,
          a: `${joinNatural(snap.map((l) => l.name))} ${snap.length === 1 ? 'accepts' : 'accept'} SNAP/EBT according to the USDA listing. Bring your EBT card to the market information booth, where many markets swap it for tokens.`,
        }
      : null,
  ].filter(Boolean) as { q: string; a: string }[]

  const ld = graph(
    breadcrumbLd(crumbs),
    itemListLd(`Farmers markets in ${c.name}, ${c.state}`, ls.map((l) => ({ name: l.name, url: `${urlFor('farmers-markets', c.stateSlug, c.slug)}#${l.slug}` }))),
    ...ls.map((l) => marketLd(l, `${urlFor('farmers-markets', c.stateSlug, c.slug)}#${l.slug}`)),
    faqLd(faq),
  )

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={`${st.name} · ${c.county ? `${c.county} County` : 'Farmers markets'}`}
        title={`Farmers markets in ${c.name}, ${c.state}`}
        lede={describe(c.name, c.state, ls.length, snap.length)}
        crumbs={crumbs}
        aside={
          <dl className="grid grid-cols-3 gap-3 text-center md:grid-cols-1 md:text-left">
            {[
              [ls.length, ls.length === 1 ? 'market' : 'markets'],
              [snap.length, 'take SNAP/EBT'],
              [wic.length, 'take WIC'],
            ].map(([n, label]) => (
              <div key={String(label)} className="rounded-2xl border border-husk/15 bg-husk/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-husk/60">{label}</dt>
                <dd className="font-display text-3xl font-extrabold text-lime">{n}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <Container className="py-10 md:py-14">
        <div className="grid gap-5">
          {ls.map((l) => (
            <MarketCard key={l.id} l={l} headingLevel={2} />
          ))}
        </div>
      </Container>

      {(c.nearby.length > 0 || csaCity || nearbyCsa.length > 0) && (
        <section className="border-y border-border bg-surface">
          <Container className="py-10 md:py-14">
            {c.nearby.length > 0 && (
              <>
                <SectionTitle sub={`Other towns near ${c.name} with markets, closest first.`}>Markets nearby</SectionTitle>
                <CityList kind="farmers-markets" cities={c.nearby} />
              </>
            )}
            {(csaCity || nearbyCsa.length > 0) && (
              <div className="mt-10">
                <SectionTitle sub="Rather have a box of the week's harvest delivered from one farm? These CSA farms are close.">CSA farms around {c.name}</SectionTitle>
                <CityList kind="csa" cities={[...(csaCity ? [csaCity] : []), ...nearbyCsa.filter((x) => x.slug !== csaCity?.slug)]} />
              </div>
            )}
          </Container>
        </section>
      )}

      <Container className="py-10 md:py-14">
        <SectionTitle>Good to know</SectionTitle>
        <div className="prose-veggyz max-w-3xl">
          {faq.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <h3>Is this list complete?</h3>
          <p>
            It&rsquo;s everything the USDA directory holds for {c.name} as of our last refresh ({sourceNote().replace('Source: ', '').replace('.', '')}). Markets self-report to the USDA, so brand-new markets and pop-ups can be missing, and hours change with the seasons. If you run a market here and something is wrong, email us and we&rsquo;ll fix it.
          </p>
        </div>
        <p className="mt-8 text-sm">
          <Link href={`/farmers-markets/${st.slug}/`} className="inline-flex items-center gap-1 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            All farmers markets in {st.name} <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </p>
      </Container>
    </>
  )
}
