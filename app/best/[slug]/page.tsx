import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ExternalLink, X } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { JsonLd } from '@/components/site/json-ld'
import { Badge } from '@/components/site/badge'
import { getGuide, guides, type Pick } from '@/content/guides'
import { linkFor } from '@/content/affiliates'
import { absolute, breadcrumbLd, faqLd, graph, itemListLd, pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const g = getGuide(slug)
  if (!g) return {}
  return pageMeta({ title: `${g.title} (${new Date(g.checked + 'T00:00:00Z').getUTCFullYear()})`, description: g.description, path: `/best/${g.slug}/` })
}

function OutLink({ pick, className, children }: { pick: Pick; className?: string; children: React.ReactNode }) {
  const o = linkFor(pick.key)
  return (
    <a
      href={o.url}
      target="_blank"
      rel={o.affiliate ? 'sponsored noopener' : 'noopener'}
      className={className}
    >
      {children}
    </a>
  )
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = getGuide(slug)
  if (!g) notFound()
  const checked = new Date(g.checked + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Delivery guides', path: '/best/' },
    { name: g.title, path: `/best/${g.slug}/` },
  ]
  const anyAffiliate = g.picks.some((p) => linkFor(p.key).affiliate)
  const ld = graph(
    breadcrumbLd(crumbs),
    {
      '@type': 'Article',
      headline: g.h1,
      description: g.description,
      datePublished: g.checked,
      dateModified: g.checked,
      author: { '@type': 'Organization', name: site.name, url: site.url },
      publisher: { '@id': absolute('/#organization') },
      mainEntityOfPage: absolute(`/best/${g.slug}/`),
    },
    itemListLd(g.h1, g.picks.map((p) => ({ name: p.name, url: linkFor(p.key).url }))),
    faqLd(g.faq),
  )

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={`Delivery guide · checked ${checked}`}
        title={g.h1}
        lede={g.intro[0]}
        crumbs={crumbs}
        aside={
          <ol className="space-y-1.5 text-sm">
            {g.picks.map((p, i) => (
              <li key={p.key} className="flex items-baseline gap-3 border-b border-husk/15 pb-1.5">
                <span className="font-display text-lg font-extrabold text-lime">{i + 1}</span>
                <a href={`#${p.key}`} className="font-semibold hover:text-lime">{p.name}</a>
                <span className="ml-auto text-right text-husk/60">{p.verdict}</span>
              </li>
            ))}
          </ol>
        }
      />

      <Container className="py-10 md:py-14">
        <div className="prose-veggyz max-w-3xl">
          {g.intro.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mt-6 max-w-3xl rounded-2xl border border-border bg-surface px-5 py-4 text-sm text-muted-foreground">
          {anyAffiliate
            ? 'Some links on this page are affiliate links: if you sign up through them, the service pays us a small fee at no cost to you. '
            : 'Links on this page are ordinary links today; we may join affiliate programs later, and will mark those links when we do. '}
          Rankings never depend on it.{' '}
          <Link href="/affiliate-disclosure/" className="underline underline-offset-4 hover:text-beet">
            How we make money
          </Link>
          .
        </p>
      </Container>

      <Container className="pb-10 md:pb-14">
        <SectionTitle sub="Per-serving prices are what you pay at a normal order size, not the first-box promo. Shipping is listed separately because it changes the maths.">At a glance</SectionTitle>
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-beet text-left text-husk">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Format</th>
                <th className="px-4 py-3 font-semibold">Shipping</th>
                <th className="px-4 py-3 font-semibold">Delivers to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {g.picks.map((p) => (
                <tr key={p.key} className="align-top">
                  <td className="px-4 py-3">
                    <a href={`#${p.key}`} className="font-semibold text-beet hover:underline underline-offset-4">{p.name}</a>
                    <span className="block text-xs text-muted-foreground">{p.verdict}</span>
                  </td>
                  <td className="px-4 py-3">{p.price}</td>
                  <td className="px-4 py-3">{p.format}</td>
                  <td className="px-4 py-3">{p.shipping}</td>
                  <td className="px-4 py-3">{p.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <Container className="pb-10 md:pb-14">
        <div className="grid gap-8">
          {g.picks.map((p, i) => (
            <article key={p.key} id={p.key} className="scroll-mt-24 rounded-3xl border border-border bg-surface p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">No. {i + 1}</p>
                  <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-beet">{p.name}</h2>
                  <Badge tone="lime" className="mt-2">{p.verdict}</Badge>
                </div>
                <OutLink
                  pick={p}
                  className="inline-flex items-center gap-2 rounded-full bg-beet px-5 py-2.5 text-sm font-semibold text-lime transition-colors hover:bg-soil"
                >
                  Visit {p.name} <ExternalLink className="size-4" aria-hidden />
                </OutLink>
              </div>
              <p className="mt-5 max-w-3xl leading-relaxed text-pretty">{p.take}</p>
              <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ['Price', p.price],
                  ['Format', p.format],
                  ['Shipping', p.shipping],
                  ['Delivers to', p.area],
                  ['Best for', p.bestFor],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6rem_1fr] gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-base font-bold text-beet">Good</h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {p.good.map((x) => (
                      <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-beet" aria-hidden />{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-beet">Not so good</h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {p.bad.map((x) => (
                      <li key={x} className="flex gap-2"><X className="mt-0.5 size-4 shrink-0 text-carrot" aria-hidden />{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      <section className="border-y border-border bg-surface">
        <Container className="py-10 md:py-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <SectionTitle>How we chose</SectionTitle>
              <ul className="prose-veggyz max-w-prose">
                {g.howWeChose.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <SectionTitle>Questions people ask</SectionTitle>
              <div className="prose-veggyz max-w-prose">
                {g.faq.map((f) => (
                  <div key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <SectionTitle>Keep reading</SectionTitle>
        <ul className="flex flex-wrap gap-3">
          {g.related.map((r) => {
            const rg = getGuide(r)
            if (!rg) return null
            return (
              <li key={r}>
                <Link href={`/best/${rg.slug}/`} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-beet hover:bg-beet hover:text-husk">
                  {rg.title} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            )
          })}
          <li>
            <Link href="/csa/" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-beet hover:bg-beet hover:text-husk">
              Or find a CSA farm near you <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </li>
        </ul>
      </Container>
    </>
  )
}
