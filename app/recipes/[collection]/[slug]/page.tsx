import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowDown, ArrowRight, ArrowRightLeft, Lightbulb } from 'lucide-react'
import { Container, PageHero, SectionTitle } from '@/components/site/page-shell'
import { JsonLd } from '@/components/site/json-ld'
import { RecipeCard } from '@/components/site/recipe-card'
import { RecipeTools } from '@/components/site/recipe-tools'
import { SearchBox } from '@/components/site/search-box'
import {
  dietLabel,
  equipmentLabel,
  getCollection,
  getRecipe,
  ingredientLine,
  recipePath,
  recipes,
  recipesUpdated,
  relatedRecipes,
  toSummary,
  totalMinutes,
} from '@/content/recipes'
import { absolute, breadcrumbLd, faqLd, graph, pageMeta, recipeLd } from '@/lib/seo'

export const dynamicParams = false

type Params = { collection: string; slug: string }

export function generateStaticParams() {
  return recipes.map((r) => ({ collection: r.collection, slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { collection, slug } = await params
  const r = getRecipe(collection, slug)
  if (!r) return {}
  return pageMeta({
    title: `${r.title} (${totalMinutes(r)} minutes)`,
    description: r.description,
    path: recipePath(r),
    image: `/recipes/cards/${r.slug}.png`,
  })
}

const stepId = (i: number) => `step-${i + 1}`

export default async function Page({ params }: { params: Promise<Params> }) {
  const { collection, slug } = await params
  const r = getRecipe(collection, slug)
  if (!r) notFound()
  const c = getCollection(r.collection)!
  const url = absolute(recipePath(r))
  const total = totalMinutes(r)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes/' },
    { name: c.title, path: `/recipes/${c.slug}/` },
    { name: r.title, path: recipePath(r) },
  ]
  const ld = graph(
    breadcrumbLd(crumbs),
    recipeLd({
      url,
      name: r.title,
      description: r.description,
      image: absolute(`/recipes/cards/${r.slug}-sq.png`),
      datePublished: recipesUpdated,
      prepMinutes: r.prepMinutes,
      cookMinutes: r.cookMinutes,
      servings: r.servings,
      category: r.category,
      cuisine: r.cuisine,
      keywords: r.keywords,
      diets: r.diets,
      ingredients: r.ingredients.flatMap((g) => g.items.map(ingredientLine)),
      steps: r.steps.map((s, i) => ({ ...s, anchor: stepId(i) })),
    }),
    faqLd(r.faq),
  )
  const facts: [string, string][] = [
    ['Prep', `${r.prepMinutes} min`],
    ['Cook', r.cookMinutes ? `${r.cookMinutes} min` : 'none'],
    ['Total', `${total} min`],
    ['Serves', String(r.servings)],
  ]
  const tags = [r.diets.includes('vegan') ? 'Vegan' : 'Vegetarian', ...r.diets.filter((d) => d !== 'vegan').map((d) => dietLabel[d]), ...r.equipment.map((e) => equipmentLabel[e])]
  const related = relatedRecipes(r, 3)
  const produceList = r.produce.slice(0, 3).join(', ').replace(/, ([^,]*)$/, ' and $1')

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={`${c.title} · ${total} minutes`}
        title={r.title}
        lede={r.spin}
        crumbs={crumbs}
        className="print:hidden"
        aside={
          <div className="grid gap-4">
            <dl className="grid grid-cols-4 gap-2 text-center">
              {facts.map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-husk/15 bg-husk/5 px-1 py-3">
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-husk/60">{k}</dt>
                  <dd className="mt-1 font-display text-lg font-bold leading-tight text-lime">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href="#recipe"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-soil transition-colors hover:bg-husk print:hidden"
            >
              Jump to recipe <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>
        }
      />

      <Container className="py-10 md:py-12 print:hidden">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{t}</span>
          ))}
        </div>
        <div className="prose-veggyz mt-6 max-w-3xl">
          {r.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Container>

      <section id="recipe" className="scroll-mt-6 border-y border-border bg-surface">
        <Container className="py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">The recipe</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-beet md:text-4xl">{r.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {facts.map(([k, v]) => `${k} ${v}`).join(' · ')}
              </p>
            </div>
            <RecipeTools />
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-14">
            <div className="md:sticky md:top-6 md:self-start">
              <h3 className="font-display text-xl font-bold text-beet">Ingredients</h3>
              <p className="mt-1 text-xs text-muted-foreground print:hidden">Tap to tick off as you go.</p>
              {r.ingredients.map((g, gi) => (
                <div key={g.title ?? gi} className="mt-5">
                  {g.title && <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{g.title}</h4>}
                  <ul className="divide-y divide-border">
                    {g.items.map((i, ii) => {
                      const id = `ing-${gi}-${ii}`
                      return (
                        <li key={id}>
                          <label htmlFor={id} className="flex cursor-pointer items-start gap-3 py-2.5 has-[:checked]:text-muted-foreground has-[:checked]:line-through">
                            <input id={id} type="checkbox" className="mt-1 size-4 shrink-0 accent-beet print:hidden" />
                            <span>
                              {i.qty && <strong className="font-semibold">{i.qty} </strong>}
                              {i.item}
                              {i.note && <span className="text-muted-foreground">, {i.note}</span>}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-beet">Method</h3>
              <ol className="mt-5 grid gap-6">
                {r.steps.map((s, i) => (
                  <li key={s.name} id={stepId(i)} className="grid scroll-mt-6 grid-cols-[2.75rem_1fr] gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-beet font-display text-lg font-extrabold text-lime" aria-hidden>
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-bold leading-tight">
                        <span className="sr-only">Step {i + 1}: </span>
                        {s.name}
                      </h4>
                      <p className="mt-1.5 leading-relaxed text-pretty">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-beet p-6 text-husk md:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-lime">
              <Lightbulb className="size-5" aria-hidden /> Good to know
            </h2>
            <ul className="mt-4 space-y-3 leading-relaxed text-husk/85">
              {r.tips.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-beet">
              <ArrowRightLeft className="size-5" aria-hidden /> Swaps
            </h2>
            <dl className="mt-4 divide-y divide-border">
              {r.swaps.map((s) => (
                <div key={s.from} className="grid gap-1 py-3 first:pt-0 last:pb-0">
                  <dt className="font-semibold">{s.from}</dt>
                  <dd className="text-muted-foreground text-pretty">{s.to}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>

      <Container className="pb-10 md:pb-14 print:hidden">
        <SectionTitle>Questions people ask</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {r.faq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-display text-lg font-bold leading-tight text-beet">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty">{f.a}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="bg-beet text-husk print:hidden">
        <Container className="py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight">
                Get the <span className="text-lime">{produceList}</span> from a farmer.
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-husk/80 text-pretty">
                This recipe is only as good as what goes in it. Find a farmers market or CSA farm near you, or{' '}
                <Link href="/best/organic-produce-delivery/" className="underline decoration-lime/60 underline-offset-4 hover:text-lime">
                  get a produce box delivered
                </Link>{' '}
                when there&rsquo;s no market this week.
              </p>
            </div>
            <SearchBox onDark placeholder="Your city or town" />
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14 print:hidden">
        <SectionTitle>Cook this next</SectionTitle>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((o) => (
            <li key={o.slug}>
              <RecipeCard r={toSummary(o)} showCollection />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href={`/recipes/${c.slug}/`} className="inline-flex items-center gap-1.5 font-semibold text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">
            All {c.title.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </>
  )
}
