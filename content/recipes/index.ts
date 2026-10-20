import type { Collection, CollectionSlug, Diet, Equipment, Recipe } from './types'
import { airFryerSalads } from './air-fryer-salads'
import { fastNoodles } from './fast-noodles'
import { breakfastForDinner } from './breakfast-for-dinner'
import { toastsAndSandwiches } from './toasts-and-sandwiches'
import { noCook } from './no-cook'

export type { Collection, CollectionSlug, Diet, Equipment, Recipe } from './types'

/** Date the recipe section was published; bump when recipes are revised. */
export const recipesUpdated = '2026-10-20'

export const collections: Collection[] = [
  {
    slug: 'air-fryer-salads',
    title: 'Air-fryer salads',
    h1: 'Air-fryer salads that earn the counter space',
    blurb: 'Charred, crispy, hot-and-cold salads where the air fryer does the interesting part.',
    description:
      'Vegetarian air-fryer salads in 30 minutes or less: crispy chickpea Caesar, hot-honey halloumi, gnocchi panzanella, feta fries and more. Tested ratios, real times.',
    intro:
      'A salad gets interesting the moment something on it is hot and crunchy. The air fryer is very good at exactly that, in a few minutes and without heating the kitchen. Each salad here has one component that comes out of the basket, and the rest is cold, sharp and fresh.',
  },
  {
    slug: 'fast-noodles',
    title: '20-minute noodles',
    h1: 'Noodles in 20 minutes, none of them boring',
    blurb: 'Pantry pasta and noodle bowls with one big idea each, done before the water would be in most recipes.',
    description:
      'Fast vegetarian noodle and pasta recipes, all 20 minutes or less: kimchi butter udon, cacio e pepe ramen, brown-butter miso pasta, tahini carbonara and more.',
    intro:
      'The quickest dinners are noodles, and the quickest way to make noodles exciting is to steal one move from another cuisine. Every bowl here is on the table in 20 minutes, using things that keep in the pantry or the fridge door.',
  },
  {
    slug: 'breakfast-for-dinner',
    title: 'Breakfast for dinner',
    h1: 'Breakfast for dinner, with a plot twist',
    blurb: 'Eggs, pancakes and toast, rebuilt as proper dinners with a savory spin.',
    description:
      'Vegetarian breakfast-for-dinner recipes in 30 minutes: saag shakshuka, waffle-iron kimchi pancakes, masala French toast, Turkish eggs on hummus and more.',
    intro:
      'Breakfast food is cheap, fast and comforting, which is everything a weeknight dinner should be. These recipes take a morning classic and give it enough spice, crunch or sauce to stand up as the main event at 7pm.',
  },
  {
    slug: 'toasts-and-sandwiches',
    title: 'Toasts & sandwiches',
    h1: 'Toasts and sandwiches worth sitting down for',
    blurb: 'Hot, crunchy, two-hands dinners: crunchwraps, melts, bánh mì and very good toast.',
    description:
      'Quick vegetarian sandwiches and toasts in 30 minutes: air-fryer crunchwrap, crispy mushroom bánh mì, kimchi pear grilled cheese, chickpea tuna melt and more.',
    intro:
      'A sandwich is dinner when it has something hot, something crunchy and something sharp. Each one here has all three, and a twist that makes it more than lunch.',
  },
  {
    slug: 'no-cook',
    title: 'No-cook dinners',
    h1: 'No-cook dinners for nights the stove stays off',
    blurb: 'Bowls, boards and cold soups that need a knife and a blender at most.',
    description:
      'No-cook vegetarian dinners in 20 minutes or less: whipped feta watermelon bowl, peach gazpacho, white bean niçoise, mango-avocado ceviche and more. No stove, no oven.',
    intro:
      'Some nights the best kitchen tool is a cutting board. These dinners need no heat at all, just good produce and one smart move: a whipped base, a quick cure, a blitz in the blender. They are at their best when the market is at its best.',
  },
]

export const recipes: Recipe[] = [...airFryerSalads, ...fastNoodles, ...breakfastForDinner, ...toastsAndSandwiches, ...noCook]

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug)
}

export function recipesIn(slug: CollectionSlug) {
  return recipes.filter((r) => r.collection === slug)
}

export function getRecipe(collection: string, slug: string) {
  return recipes.find((r) => r.collection === collection && r.slug === slug)
}

export function totalMinutes(r: Recipe) {
  return r.prepMinutes + r.cookMinutes
}

export function recipePath(r: Pick<Recipe, 'collection' | 'slug'>) {
  return `/recipes/${r.collection}/${r.slug}/`
}

/** Related recipes: same collection first, then shared protein / produce / equipment. */
export function relatedRecipes(r: Recipe, n = 3) {
  const score = (o: Recipe) =>
    (o.collection === r.collection ? 3 : 0) +
    (o.protein === r.protein ? 2 : 0) +
    o.produce.filter((p) => r.produce.includes(p)).length +
    o.equipment.filter((e) => r.equipment.includes(e)).length * 0.5
  return recipes
    .filter((o) => o.slug !== r.slug)
    .map((o) => ({ o, s: score(o) }))
    .sort((a, b) => b.s - a.s || a.o.title.localeCompare(b.o.title))
    .slice(0, n)
    .map((x) => x.o)
}

export const equipmentLabel: Record<Equipment, string> = {
  'air-fryer': 'Air fryer',
  stovetop: 'Stovetop',
  oven: 'Oven',
  'no-cook': 'No cooking',
  'waffle-iron': 'Waffle iron',
  blender: 'Blender',
  microwave: 'Microwave',
}

export const dietLabel: Record<Diet, string> = {
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
  'egg-free': 'Egg-free',
}

/** ISO 8601 duration for schema.org, e.g. PT25M */
export function isoMinutes(m: number) {
  return `PT${m}M`
}

export function ingredientLine(i: { qty?: string; item: string; note?: string }) {
  return [i.qty, i.item].filter(Boolean).join(' ') + (i.note ? `, ${i.note}` : '')
}

/** Card-sized view of a recipe (see components/site/recipe-card.tsx) */
export function toSummary(r: Recipe) {
  return {
    href: recipePath(r),
    title: r.title,
    spin: r.spin,
    minutes: totalMinutes(r),
    equipment: r.equipment,
    equipmentLabels: r.equipment.map((e) => equipmentLabel[e]),
    diets: r.diets,
    collection: r.collection,
    collectionTitle: getCollection(r.collection)?.title ?? '',
    protein: r.protein,
  }
}
