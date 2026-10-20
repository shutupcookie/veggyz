import type { Metadata } from 'next'
import { site } from './site'
import type { CsaListing, Listing } from './data'

export function absolute(path: string) {
  return new URL(path, site.url).toString()
}

export function pageMeta(opts: {
  title: string
  description: string
  path: string
  noindex?: boolean
  image?: string
}): Metadata {
  const url = absolute(opts.path)
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: 'website',
      images: [{ url: absolute(opts.image ?? '/og-default.png'), width: 1200, height: 630, alt: site.tagline }],
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  }
}

// ------------------------------------------------------------ JSON-LD ---

export type JsonLd = Record<string, unknown>

export function organizationLd(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': absolute('/#organization'),
    name: site.name,
    url: site.url,
    logo: absolute('/brand/logos/veggyz-app-icon-beet.svg'),
    email: site.email,
    slogan: site.tagline,
  }
}

export function websiteLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': absolute('/#website'),
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { '@id': absolute('/#organization') },
    inLanguage: 'en-US',
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  }
}

function postalAddress(l: Listing) {
  const streetAddress = l.address
    ? l.address
        .replace(new RegExp(`,?\\s*${l.city}\\s*,?.*$`, 'i'), '')
        .replace(/[\s,]+$/, '')
    : undefined
  return {
    '@type': 'PostalAddress',
    streetAddress: streetAddress && streetAddress !== l.address ? streetAddress : undefined,
    addressLocality: l.city,
    addressRegion: l.state,
    postalCode: l.zip ?? undefined,
    addressCountry: 'US',
  }
}

/** A farmers market as schema.org LocalBusiness (there is no dedicated type) */
export function marketLd(l: Listing, url: string): JsonLd {
  return {
    '@type': 'LocalBusiness',
    '@id': url,
    additionalType: 'http://www.productontology.org/id/Farmers%27_market',
    name: l.name,
    url,
    description: l.description ?? undefined,
    address: postalAddress(l),
    geo: l.lat != null ? { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lng } : undefined,
    paymentAccepted: l.payment.length ? l.payment.join(', ') : undefined,
    keywords: [l.snap ? 'SNAP/EBT accepted' : null, l.wic ? 'WIC accepted' : null, ...l.production]
      .filter(Boolean)
      .join(', ') || undefined,
    isAccessibleForFree: true,
  }
}

export function csaLd(l: CsaListing, url: string): JsonLd {
  const products = [...l.vegetables, ...l.fruit, ...l.otherProducts]
  return {
    '@type': ['LocalBusiness', 'Organization'],
    '@id': url,
    additionalType: 'https://en.wikipedia.org/wiki/Community-supported_agriculture',
    name: l.name,
    url,
    description: l.description ?? undefined,
    address: postalAddress(l),
    geo: l.lat != null ? { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lng } : undefined,
    paymentAccepted: l.payment.length ? l.payment.join(', ') : undefined,
    makesOffer: l.shareSizes.length
      ? l.shareSizes.map((s) => ({ '@type': 'Offer', name: `${s} CSA share`, category: 'CSA share' }))
      : undefined,
    keywords: products.length ? products.slice(0, 20).join(', ') : undefined,
  }
}

export function itemListLd(name: string, items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })),
  }
}

export function faqLd(qa: { q: string; a: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: qa.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  }
}

export function graph(...nodes: (JsonLd | null | undefined)[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}

export function recipeLd(r: {
  url: string
  name: string
  description: string
  image: string
  datePublished: string
  prepMinutes: number
  cookMinutes: number
  servings: number
  category: string
  cuisine: string
  keywords: string[]
  diets: string[]
  ingredients: string[]
  steps: { name: string; text: string; anchor: string }[]
}): JsonLd {
  const dietMap: Record<string, string> = {
    vegan: 'https://schema.org/VeganDiet',
    'gluten-free': 'https://schema.org/GlutenFreeDiet',
  }
  return {
    '@type': 'Recipe',
    '@id': `${r.url}#recipe`,
    name: r.name,
    description: r.description,
    image: [r.image],
    url: r.url,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    publisher: { '@id': absolute('/#organization') },
    datePublished: r.datePublished,
    prepTime: `PT${r.prepMinutes}M`,
    cookTime: `PT${r.cookMinutes}M`,
    totalTime: `PT${r.prepMinutes + r.cookMinutes}M`,
    recipeYield: `${r.servings} servings`,
    recipeCategory: r.category,
    recipeCuisine: r.cuisine,
    keywords: r.keywords.join(', '),
    suitableForDiet: ['https://schema.org/VegetarianDiet', ...r.diets.map((d) => dietMap[d]).filter(Boolean)],
    recipeIngredient: r.ingredients,
    recipeInstructions: r.steps.map((s) => ({
      '@type': 'HowToStep',
      name: s.name,
      text: s.text,
      url: `${r.url}#${s.anchor}`,
    })),
  }
}
