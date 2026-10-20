import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { ArrowRight, CookingPot, Leaf, MapPin, ShoppingBasket } from 'lucide-react'
import { SearchBox } from '@/components/site/search-box'
import { Container, SectionTitle } from '@/components/site/page-shell'
import { CityList } from '@/components/site/directory-nav'
import { getDirectory, topCities, total } from '@/lib/data'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'
import { guides } from '@/content/guides'
import { collections, recipes, toSummary } from '@/content/recipes'
import { RecipeCard } from '@/components/site/recipe-card'

export const metadata: Metadata = pageMeta({
  title: `${site.name} — farmers markets, CSA farms and plant-based delivery, near you`,
  description: site.description,
  path: '/',
})

export default function HomePage() {
  const markets = total('farmers-markets')
  const csas = total('csa')
  const states = getDirectory('farmers-markets').states.length
  const cities = topCities('farmers-markets', 14)
  const featured = collections.slice(0, 3).map((c) => recipes.find((r) => r.collection === c.slug)!).filter(Boolean)

  return (
    <>
      <section className="bg-beet text-husk">
        <Container className="pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-lime">
                {markets.toLocaleString('en-US')} markets · {csas.toLocaleString('en-US')} CSA farms · {states} states
              </p>
              <h1 className="font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-balance md:text-7xl">
                Real vegetables, <span className="text-lime">near you.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-husk/80 text-pretty">
                Every farmers market and CSA farm in the USDA&rsquo;s directories, sorted by city, with the
                boring-but-useful bits: where it is, whether it takes SNAP, what&rsquo;s in the box. Free, no
                signup, no nonsense.
              </p>
              <div className="mt-8 max-w-xl">
                <SearchBox onDark placeholder="Your city or town, e.g. Portland" />
                <p className="mt-2 text-sm text-husk/60">Try a city name, then pick markets or CSA farms.</p>
              </div>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                { icon: MapPin, title: 'Farmers markets', body: 'By state and city, with SNAP/EBT, WIC and payment info.', href: '/farmers-markets/' },
                { icon: Leaf, title: 'CSA farms', body: 'Weekly veg boxes straight from a farm. Seasons, share sizes, pickup.', href: '/csa/' },
                { icon: CookingPot, title: 'Quick recipes', body: 'Vegetarian dinners in 30 minutes, each with a twist.', href: '/recipes/' },
                { icon: ShoppingBasket, title: 'Delivery guides', body: 'Plant-based meal kits and produce boxes, compared honestly.', href: '/best/' },
              ].map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="group flex items-start gap-3 rounded-2xl border border-husk/15 bg-husk/5 p-4 transition-colors hover:bg-husk hover:text-soil"
                  >
                    <c.icon className="mt-0.5 size-5 shrink-0 text-lime group-hover:text-beet" aria-hidden />
                    <span>
                      <span className="block font-display text-lg font-bold leading-tight">{c.title}</span>
                      <span className="mt-1 block text-husk/75 group-hover:text-muted-foreground">{c.body}</span>
                    </span>
                    <ArrowRight className="ml-auto mt-1 size-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <SectionTitle sub="The cities with the most markets in the directory. Not near any of them? Search above or browse by state.">
          Big market towns
        </SectionTitle>
        <CityList kind="farmers-markets" cities={cities} />
        <div className="mt-6">
          <Link href="/farmers-markets/" className="inline-flex items-center gap-1.5 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            All {states} states <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>

      <Container className="pb-14 md:pb-20">
        <SectionTitle sub={`${recipes.length} vegetarian dinners, all 30 minutes or less, each with one twist worth stealing.`}>
          Now cook it
        </SectionTitle>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <li key={r.slug}>
              <RecipeCard r={toSummary(r)} showCollection />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href="/recipes/" className="inline-flex items-center gap-1.5 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            All {recipes.length} recipes <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>

      <section className="border-y border-border bg-surface">
        <Container className="py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <SectionTitle sub="Not every week is a market week. When you need vegetables delivered, these are the services worth your money, with the prices and catches spelled out.">
                Delivery, compared honestly
              </SectionTitle>
              <p className="text-sm text-muted-foreground">
                Some of these links pay us a referral fee. It never changes the order or the verdict.{' '}
                <Link href="/affiliate-disclosure/" className="underline underline-offset-4 hover:text-beet">
                  How we make money
                </Link>
                .
              </p>
            </div>
            <ul className="grid gap-3">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/best/${g.slug}/`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-beet hover:bg-beet hover:text-husk"
                  >
                    <span>
                      <span className="block font-display text-lg font-bold leading-tight">{g.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground group-hover:text-husk/75">{g.blurb}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 opacity-60" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            ['Where it grew', 'Every listing has an address and a map link. Most have coordinates too, so nearby towns are a click away.'],
            ['Who grew it', 'CSA pages show what each farm actually puts in the box, the season, share sizes and how you pay.'],
            ['What it costs', 'Delivery guides list real per-serving prices and the fine print, checked by a human and dated.'],
          ].map(([h, b]) => (
            <div key={h} className="rounded-2xl bg-beet p-6 text-husk">
              <h3 className="font-display text-2xl font-bold text-lime">{h}</h3>
              <p className="mt-2 leading-relaxed text-husk/80 text-pretty">{b}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
