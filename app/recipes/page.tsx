import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { ArrowRight } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { JsonLd } from '@/components/site/json-ld'
import { RecipeFilter } from '@/components/site/recipe-filter'
import { collections, recipePath, recipes, recipesIn, toSummary, totalMinutes } from '@/content/recipes'
import { absolute, breadcrumbLd, graph, itemListLd, pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Quick vegetarian recipes with a twist, all 30 minutes or less',
  description:
    'Fast vegetarian recipes with one smart spin each: air-fryer salads, 20-minute noodles, breakfast for dinner, sandwiches and no-cook dinners. No life stories.',
  path: '/recipes/',
})

export default function Page() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Recipes', path: '/recipes/' }]
  const fastest = Math.min(...recipes.map(totalMinutes))
  const vegan = recipes.filter((r) => r.diets.includes('vegan')).length
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbLd(crumbs),
          {
            '@type': 'CollectionPage',
            '@id': absolute('/recipes/'),
            name: 'Veggyz recipes',
            url: absolute('/recipes/'),
            isPartOf: { '@id': absolute('/#website') },
          },
          itemListLd('Quick vegetarian recipes', recipes.map((r) => ({ name: r.title, url: absolute(recipePath(r)) }))),
        )}
      />
      <PageHero
        eyebrow={`${recipes.length} recipes · all vegetarian · ${vegan} vegan`}
        title={
          <>
            Quick dinners, <span className="text-lime">one good twist.</span>
          </>
        }
        lede="Every recipe here is vegetarian, done in 30 minutes or less, and has a spin you won't find on the first page of search: lettuce that goes in the air fryer, ramen made like cacio e pepe, pancakes cooked in a waffle iron. Recipe first, no life story."
        crumbs={crumbs}
        aside={
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              [String(recipes.length), 'recipes'],
              [`${fastest}`, 'min, fastest'],
              ['30', 'min, max'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-husk/15 bg-husk/5 px-2 py-4">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block font-display text-4xl font-extrabold text-lime">{n}</span>
                  <span className="text-xs text-husk/70">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <Container className="py-12 md:py-16">
        <SectionTitle sub="Five ways in. Pick the mood, or the one appliance you can face washing tonight.">Collections</SectionTitle>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/recipes/${c.slug}/`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-beet hover:bg-beet hover:text-husk"
              >
                <span className="font-display text-xl font-bold leading-tight">{c.title}</span>
                <span className="mt-2 text-sm text-muted-foreground group-hover:text-husk/75">{c.blurb}</span>
                <span className="mt-auto pt-4 text-sm font-semibold">
                  {recipesIn(c.slug).length} recipes <ArrowRight className="ml-0.5 inline size-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="pb-4">
        <SectionTitle sub="Filter by how long you have, what you'll cook it in, and who's eating.">Every recipe</SectionTitle>
        <RecipeFilter recipes={recipes.map(toSummary)} />
      </Container>

      <Container className="pt-12">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Recipes are only as good as the vegetables.{' '}
          <Link href="/farmers-markets/" className="font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            Find a farmers market
          </Link>{' '}
          or{' '}
          <Link href="/csa/" className="font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            a CSA farm
          </Link>{' '}
          near you.
        </p>
      </Container>
    </>
  )
}
