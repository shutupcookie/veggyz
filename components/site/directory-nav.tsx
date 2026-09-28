import Link from '@/components/site/link'
import type { City, Kind, NearbyCity, StateSummary } from '@/lib/data'
import { kindPath } from '@/lib/data'
import { cn } from '@/lib/utils'

export function StateGrid({ kind, states }: { kind: Kind; states: StateSummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {states.map((s) => (
        <li key={s.abbr}>
          <Link
            href={`${kindPath(kind)}/${s.slug}/`}
            className="flex items-baseline justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-beet hover:bg-beet hover:text-husk"
          >
            <span className="font-semibold">{s.name}</span>
            <span className="text-sm tabular-nums opacity-70">{s.count.toLocaleString('en-US')}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function CityList({ kind, cities, className }: { kind: Kind; cities: (City | NearbyCity)[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {cities.map((c) => (
        <li key={`${c.state}-${c.slug}`}>
          <Link
            href={`${kindPath(kind)}/${c.stateSlug}/${c.slug}/`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-beet hover:bg-beet hover:text-husk"
          >
            <span>{c.name}</span>
            <span className="tabular-nums opacity-60">{c.count}</span>
            {'mi' in c && <span className="text-xs opacity-60">{c.mi} mi</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Alphabetical, multi-column list for state pages with many cities */
export function CityColumns({ kind, cities }: { kind: Kind; cities: City[] }) {
  const groups = new Map<string, City[]>()
  for (const c of cities) {
    const k = c.name[0].toUpperCase()
    ;(groups.get(k) ?? groups.set(k, []).get(k)!).push(c)
  }
  return (
    <div className="columns-2 gap-8 sm:columns-3 lg:columns-4">
      {[...groups.entries()].map(([letter, cs]) => (
        <section key={letter} className="mb-6 break-inside-avoid">
          <h3 className="font-display text-lg font-bold text-beet">{letter}</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {cs.map((c) => (
              <li key={c.slug}>
                <Link href={`${kindPath(kind)}/${c.stateSlug}/${c.slug}/`} className="hover:text-beet hover:underline underline-offset-4">
                  {c.name} <span className="text-muted-foreground">({c.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
