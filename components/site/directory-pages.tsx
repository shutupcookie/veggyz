import Link from '@/components/site/link'
import { ArrowRight } from 'lucide-react'
import { SearchBox } from './search-box'
import { Container, PageHero, SectionTitle } from './page-shell'
import { StateGrid, CityList, CityColumns } from './directory-nav'
import { JsonLd } from './json-ld'
import { getDirectory, getCitiesForState, kindLabel, kindPath, topCities, type Kind, type StateSummary } from '@/lib/data'
import { plural } from '@/lib/format'
import { absolute, breadcrumbLd, graph } from '@/lib/seo'
import { site } from '@/lib/site'

const copy = {
  'farmers-markets': {
    eyebrow: 'Farmers markets',
    title: 'Farmers markets by state',
    lede: (n: number, s: number) =>
      `${n.toLocaleString('en-US')} markets across ${s} states and territories, from the USDA's National Farmers Market Directory. Pick a state, then a town.`,
    stateLede: (st: string, n: number, c: number) =>
      `${plural(n, 'farmers market')} in ${plural(c, 'town')} across ${st}. Listings include the address, a map link, and whether the market takes SNAP/EBT or WIC.`,
    searchLabel: 'Find markets in a city',
  },
  csa: {
    eyebrow: 'CSA farms',
    title: 'CSA farms by state',
    lede: (n: number, s: number) =>
      `${n.toLocaleString('en-US')} community-supported agriculture farms across ${s} states, from the USDA's CSA Directory. Buy a share, get a box of whatever's growing.`,
    stateLede: (st: string, n: number, c: number) =>
      `${plural(n, 'CSA farm')} in ${plural(c, 'town')} across ${st}, with seasons, share sizes and what goes in the box where the farm has told the USDA.`,
    searchLabel: 'Find CSA farms near a city',
  },
}

export function DirectoryIndex({ kind }: { kind: Kind }) {
  const d = getDirectory(kind)
  const c = copy[kind]
  const crumbs = [{ name: 'Home', path: '/' }, { name: c.eyebrow, path: `${kindPath(kind)}/` }]
  return (
    <>
      <JsonLd data={graph(breadcrumbLd(crumbs))} />
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lede={c.lede(d.listings.length, d.states.length)}
        crumbs={crumbs}
        aside={
          <div>
            <p className="mb-2 text-sm font-semibold text-husk/80">{c.searchLabel}</p>
            <SearchBox kind={kind === 'csa' ? 'c' : 'f'} onDark />
          </div>
        }
      />
      <Container className="py-12 md:py-16">
        <SectionTitle>Browse by state</SectionTitle>
        <StateGrid kind={kind} states={d.states} />
      </Container>
      <Container className="pb-12 md:pb-16">
        <SectionTitle sub={`The towns with the most ${kindLabel(kind)} listed.`}>Most listings</SectionTitle>
        <CityList kind={kind} cities={topCities(kind, 24)} />
      </Container>
      <Container className="pb-4">
        <p className="text-sm text-muted-foreground">
          Source: {site.dataSource.name}, snapshot {site.dataSource.snapshot}. Listings are self-reported by markets and farms; hours and seasons change, so check before you drive.
        </p>
      </Container>
    </>
  )
}

export function DirectoryState({ kind, state }: { kind: Kind; state: StateSummary }) {
  const c = copy[kind]
  const cities = getCitiesForState(kind, state.abbr)
  const top = [...cities].sort((a, b) => b.count - a.count).slice(0, 12).filter((x) => x.count >= 2)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: c.eyebrow, path: `${kindPath(kind)}/` },
    { name: state.name, path: `${kindPath(kind)}/${state.slug}/` },
  ]
  const label = kindLabel(kind, 2)
  return (
    <>
      <JsonLd data={graph(breadcrumbLd(crumbs))} />
      <PageHero
        eyebrow={c.eyebrow}
        title={`${state.name} ${label}`}
        lede={c.stateLede(state.name, state.count, state.cities)}
        crumbs={crumbs}
        aside={
          <div>
            <p className="mb-2 text-sm font-semibold text-husk/80">Jump to a town</p>
            <SearchBox kind={kind === 'csa' ? 'c' : 'f'} onDark placeholder={`Town in ${state.name}`} />
          </div>
        }
      />
      {top.length > 0 && (
        <Container className="pt-12 md:pt-16">
          <SectionTitle>Most {label} in {state.name}</SectionTitle>
          <CityList kind={kind} cities={top} />
        </Container>
      )}
      <Container className="py-12 md:py-16">
        <SectionTitle sub={`Every town in ${state.name} with at least one listing.`}>All towns, A to Z</SectionTitle>
        <CityColumns kind={kind} cities={cities} />
      </Container>
      <Container className="pb-4">
        <p className="text-sm text-muted-foreground">
          Looking for the other kind?{' '}
          <Link href={`${kind === 'csa' ? '/farmers-markets' : '/csa'}/${state.slug}/`} className="font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            {kind === 'csa' ? 'Farmers markets' : 'CSA farms'} in {state.name} <ArrowRight className="inline size-3.5" aria-hidden />
          </Link>
        </p>
      </Container>
    </>
  )
}

export function sourceNote() {
  return `Source: ${site.dataSource.name}, snapshot ${site.dataSource.snapshot}.`
}

export function urlFor(kind: Kind, stateSlug: string, citySlug?: string, slug?: string) {
  let p = `${kindPath(kind)}/${stateSlug}/`
  if (citySlug) p += `${citySlug}/`
  if (slug) p += `${slug}/`
  return absolute(p)
}
