/**
 * Recipe data model.
 *
 * Every recipe is vegetarian, on the table in 30 minutes or less, and has one
 * "spin": the twist that makes it worth publishing instead of the hundredth
 * copy of a classic. Quantities are US customary (cups, tbsp, oz, °F).
 */

export type CollectionSlug = 'air-fryer-salads' | 'fast-noodles' | 'breakfast-for-dinner' | 'toasts-and-sandwiches' | 'no-cook'

export type Equipment = 'air-fryer' | 'stovetop' | 'oven' | 'no-cook' | 'waffle-iron' | 'blender' | 'microwave'

/** Every recipe is vegetarian; these are the extra labels that also apply. */
export type Diet = 'vegan' | 'gluten-free' | 'dairy-free' | 'egg-free'

export interface Ingredient {
  /** "1 cup", "2 tbsp", "1 (15-oz) can" — omit for "salt, to taste" style lines */
  qty?: string
  item: string
  /** "drained and patted dry", "or feta" */
  note?: string
}

export interface IngredientGroup {
  /** "For the dressing" — omit for a single ungrouped list */
  title?: string
  items: Ingredient[]
}

export interface Step {
  /** Short imperative heading, 2–5 words: "Crisp the chickpeas" */
  name: string
  text: string
}

export interface Recipe {
  slug: string
  collection: CollectionSlug
  title: string
  /** One sentence: what the twist is and why it works. Shown on cards. */
  spin: string
  /** Meta description, 140–160 characters */
  description: string
  /** 2 short paragraphs, friendly and specific, no life story */
  intro: string[]
  prepMinutes: number
  cookMinutes: number
  servings: number
  /** "Salad", "Main", "Breakfast", "Sandwich", "Bowl", "Soup", "Snack" */
  category: string
  /** "Mediterranean", "Korean-inspired", "American"… */
  cuisine: string
  equipment: Equipment[]
  diets: Diet[]
  /** Main protein source, lowercase: "chickpeas", "halloumi", "eggs", "tofu" */
  protein: string
  /** Hero produce, lowercase, 2–5 items — used to link to markets and in-season notes */
  produce: string[]
  ingredients: IngredientGroup[]
  steps: Step[]
  /** 2–4 practical tips that only someone who cooked it would know */
  tips: string[]
  /** 2–4 swaps: make it vegan, gluten-free, or use what you have */
  swaps: { from: string; to: string }[]
  /** 3 questions people actually search, answered in 1–3 sentences */
  faq: { q: string; a: string }[]
  keywords: string[]
}

export interface Collection {
  slug: CollectionSlug
  title: string
  /** H1 on the collection page */
  h1: string
  blurb: string
  description: string
  intro: string
}
