import { cn } from '@/lib/utils'
import { Breadcrumbs, type Crumb } from './breadcrumbs'

/** Beet hero band used at the top of directory and guide pages */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  aside,
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  lede?: React.ReactNode
  crumbs?: Crumb[]
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('bg-beet text-husk', className)}>
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-8 md:pb-16 md:pt-10">
        {crumbs && (
          <div className="mb-6 text-husk/70 [&_a:hover]:text-lime [&_a]:text-husk/70 [&_span[aria-current]]:text-husk">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-end">
          <div>
            {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-lime">{eyebrow}</p>}
            <h1 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-balance md:text-6xl">
              {title}
            </h1>
            {lede && <p className="mt-5 max-w-2xl text-base leading-relaxed text-husk/80 text-pretty md:text-lg">{lede}</p>}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </div>
    </section>
  )
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto max-w-6xl px-5 md:px-8', className)}>{children}</div>
}

export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-bold tracking-tight text-beet md:text-3xl">{children}</h2>
      {sub && <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">{sub}</p>}
    </div>
  )
}
