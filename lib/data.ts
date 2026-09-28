import 'server-only'
import fs from 'node:fs'
import path from 'node:path'

export type Kind = 'farmers-markets' | 'csa'

export interface Listing {
  id: string
  kind: Kind
  name: string
  slug: string
  address: string | null
  city: string
  citySlug: string
  county: string | null
  state: string
  stateSlug: string
  zip: string | null
  lat: number | null
  lng: number | null
  description: string | null
  locationNote: string | null
  siteType: string[]
  indoor: string | null
  production: string[]
  payment: string[]
  snap: boolean
  wic: boolean
  senior: boolean
  snapNote: string | null
  incentives: string | null
  onlineOrder: string | null
  delivery: string[]
  csaVendors: string | null
  organizations: string[]
  updatedAt: string | null
}

export interface CsaListing extends Listing {
  season: string | null
  seasonWeeks: number | null
  seasonNote: string | null
  vegetables: string[]
  fruit: string[]
  otherProducts: string[]
  shareSizes: string[]
  shareCount: number | null
  shareContents: string | null
  paymentPlan: string[]
  pickup: string[]
  farms: number | null
  yearsOperating: string | null
}

export interface NearbyCity {
  state: string
  stateSlug: string
  name: string
  slug: string
  count: number
  mi: number
}

export interface City {
  state: string
  stateSlug: string
  name: string
  slug: string
  county: string | null
  lat: number | null
  lng: number | null
  count: number
  nearby: NearbyCity[]
}

export interface StateSummary {
  abbr: string
  name: string
  slug: string
  count: number
  cities: number
}

export interface Directory<L extends Listing = Listing> {
  listings: L[]
  cities: City[]
  states: StateSummary[]
  stats: Record<string, number | string>
}

const cache = new Map<Kind, Directory>()

export function getDirectory(kind: 'csa'): Directory<CsaListing>
export function getDirectory(kind: 'farmers-markets'): Directory<Listing>
export function getDirectory(kind: Kind): Directory
export function getDirectory(kind: Kind): Directory {
  let d = cache.get(kind)
  if (!d) {
    const file = path.join(process.cwd(), 'data', 'generated', `${kind}.json`)
    d = JSON.parse(fs.readFileSync(file, 'utf8')) as Directory
    cache.set(kind, d)
  }
  return d
}

export function getState(kind: Kind, stateSlug: string) {
  return getDirectory(kind).states.find((s) => s.slug === stateSlug) ?? null
}

export function getCitiesForState(kind: Kind, stateAbbr: string) {
  return getDirectory(kind).cities.filter((c) => c.state === stateAbbr)
}

export function getCity(kind: Kind, stateSlug: string, citySlug: string) {
  return getDirectory(kind).cities.find((c) => c.stateSlug === stateSlug && c.slug === citySlug) ?? null
}

export function getListingsForCity(kind: Kind, stateAbbr: string, citySlug: string) {
  return getDirectory(kind).listings.filter((l) => l.state === stateAbbr && l.citySlug === citySlug)
}

export function getListingsForState(kind: Kind, stateAbbr: string) {
  return getDirectory(kind).listings.filter((l) => l.state === stateAbbr)
}

export function getListing(kind: Kind, stateSlug: string, citySlug: string, slug: string) {
  return (
    getDirectory(kind).listings.find(
      (l) => l.stateSlug === stateSlug && l.citySlug === citySlug && l.slug === slug,
    ) ?? null
  )
}

export function kindLabel(kind: Kind, n = 2) {
  if (kind === 'csa') return n === 1 ? 'CSA farm' : 'CSA farms'
  return n === 1 ? 'farmers market' : 'farmers markets'
}

export function kindPath(kind: Kind) {
  return kind === 'csa' ? '/csa' : '/farmers-markets'
}

export function total(kind: Kind) {
  return getDirectory(kind).listings.length
}

/** Top cities by listing count across a directory */
export function topCities(kind: Kind, n = 12) {
  return [...getDirectory(kind).cities].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, n)
}

const R = 3958.8
export function distanceMi(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Nearest other listings of the same kind (for single-listing pages) */
export function nearbyListings<L extends Listing>(kind: Kind, from: L, n = 6, maxMi = 40): (L & { mi: number })[] {
  if (from.lat == null || from.lng == null) return []
  const out: (L & { mi: number })[] = []
  for (const l of getDirectory(kind).listings as L[]) {
    if (l.id === from.id || l.lat == null || l.lng == null) continue
    const mi = distanceMi(from.lat, from.lng, l.lat, l.lng)
    if (mi <= maxMi) out.push({ ...l, mi })
  }
  out.sort((a, b) => a.mi - b.mi)
  return out.slice(0, n)
}
