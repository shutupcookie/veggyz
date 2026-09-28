import { ExternalLink, MapPin } from 'lucide-react'
import type { Listing } from '@/lib/data'
import { formatDate, mapsUrl, tidy } from '@/lib/format'
import { Badge } from './badge'

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  )
}

export function MarketCard({ l, headingLevel = 3 }: { l: Listing; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const desc = tidy(l.description)
  const where = tidy(l.locationNote)
  const production = l.production.filter((p) => !/^no /i.test(p))
  return (
    <article
      id={l.slug}
      className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_0_rgba(26,26,23,0.04)] md:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <H className="font-display text-xl font-bold leading-tight text-beet md:text-2xl">{l.name}</H>
        <div className="flex flex-wrap gap-1.5">
          {l.snap && <Badge tone="lime">SNAP / EBT</Badge>}
          {l.wic && <Badge tone="beet">WIC</Badge>}
          {l.senior && <Badge tone="beet">Senior FMNP</Badge>}
          {l.indoor && /yes|indoor/i.test(l.indoor) && !/no indoor/i.test(l.indoor) && <Badge>Indoor</Badge>}
        </div>
      </div>
      {l.address && (
        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{l.address}</span>
        </p>
      )}
      {desc && <p className="mt-4 leading-relaxed text-pretty">{desc}</p>}
      <dl className="mt-4 space-y-2">
        {where && <Detail label="Where exactly">{where}</Detail>}
        {l.siteType.length > 0 && <Detail label="Setting">{l.siteType.join(', ')}</Detail>}
        {production.length > 0 && <Detail label="Vendors offer">{production.join(', ')}</Detail>}
        {l.payment.length > 0 && <Detail label="Payment">{l.payment.join(', ')}</Detail>}
        {l.snap && l.snapNote && <Detail label="EBT">{l.snapNote}</Detail>}
        {l.incentives && <Detail label="Incentives">{tidy(l.incentives)}</Detail>}
        {l.onlineOrder && <Detail label="Order ahead">{tidy(l.onlineOrder)}</Detail>}
        {l.csaVendors && <Detail label="CSA shares">{tidy(l.csaVendors)}</Detail>}
      </dl>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        <a
          href={mapsUrl(l)}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet"
        >
          Open in Google Maps <ExternalLink className="size-3.5" aria-hidden />
        </a>
        {l.updatedAt && <span className="text-muted-foreground">USDA listing updated {formatDate(l.updatedAt)}</span>}
      </div>
    </article>
  )
}
