import Link from '@/components/site/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { CsaListing } from '@/lib/data'
import { tidy, truncate } from '@/lib/format'
import { Badge } from './badge'

export function csaPath(l: CsaListing) {
  return `/csa/${l.stateSlug}/${l.citySlug}/${l.slug}/`
}

export function CsaCard({ l, mi }: { l: CsaListing; mi?: number }) {
  const desc = tidy(l.description)
  const veg = l.vegetables.slice(0, 6)
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold leading-tight text-beet">
          <Link href={csaPath(l)} className="hover:underline underline-offset-4">
            {l.name}
          </Link>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {l.snap && <Badge tone="lime">SNAP / EBT</Badge>}
          {l.production.some((p) => /organic/i.test(p)) && <Badge tone="beet">Organic</Badge>}
        </div>
      </div>
      <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          {l.city}, {l.state}
          {l.county ? ` · ${l.county} County` : ''}
          {mi != null ? ` · ${Math.round(mi)} mi away` : ''}
        </span>
      </p>
      {l.season && <p className="mt-3 text-sm"><span className="text-muted-foreground">Season:</span> {l.season}{l.seasonWeeks ? ` (${l.seasonWeeks} weeks)` : ''}</p>}
      {desc ? (
        <p className="mt-3 text-sm leading-relaxed text-pretty">{truncate(desc, 200)}</p>
      ) : veg.length > 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-pretty">
          <span className="text-muted-foreground">In the box:</span> {veg.join(', ')}
          {l.vegetables.length > 6 ? ` and ${l.vegetables.length - 6} more` : ''}
        </p>
      ) : null}
      {l.shareSizes.length > 0 && (
        <p className="mt-2 text-sm"><span className="text-muted-foreground">Shares:</span> {l.shareSizes.join(', ')}</p>
      )}
      <div className="mt-auto pt-4">
        <Link
          href={csaPath(l)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet"
        >
          Farm details <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
