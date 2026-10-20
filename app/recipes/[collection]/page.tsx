import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { JsonLd } from '@/components/site/json-ld'
import { RecipeCard } from '@/components/site/recipe-card'
import { collections, getCollection, recipePath, recipesIn, toSummary, totalMinutes, type CollectionSlug } from '@/content/recipes'
import { absolute, breadcrumbLd, graph, itemListLd, pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params
  const c = getCollection(collection)
  if (!c) return {}
  return pageMeta({ title: `${c.h1}`, description: c.description, path: `/recipes/${c.slug}/` })
}

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  const c = getCollection(collection)
  if (!c) notFound()
  const list = recipesIn(c.slug as CollectionSlug)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes/' },
    { name: c.title, path: `/recipes/${c.slug}/` },
  ]
  const quickest = Math.min(...list.map(totalMinutes))
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd(crumbs),
          {
            '@type': 'CollectionPage',
            '@id': absolute(`/recipes/${c.slug}/`),
            name: c.h1,
            description: c.description,
            url: absolute(`/recipes/${c.slug}/`),
            isPartOf: { '@id': absolute('/#website') },
          },
          itemListLd(c.h1, list.map((r) => ({ name: r.title, url: absolute(recipePath(r)) }))),
        )}
      />
      <PageHero
        eyebrow={`${list.length} recipes · from ${quickest} minutes · all vegetarian`}
        title={c.h1}
        lede={c.intro}
        crumbs={crumbs}
      />
      <Container className="py-12 md:py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <li key={r.slug}>
              <RecipeCard r={toSummary(r)} />
            </li>
          ))}
        </ul>
      </Container>
      <Container>
        <SectionTitle>More collections</SectionTitle>
        <ul className="flex flex-wrap gap-3">
          {collections
            .filter((o) => o.slug !== c.slug)
            .map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/recipes/${o.slug}/`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-beet hover:bg-beet hover:text-husk"
                >
                  {o.title} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          <li>
            <Link
              href="/recipes/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-beet hover:bg-beet hover:text-husk"
            >
              All recipes <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </li>
        </ul>
      </Container>
    </>
  )
}
