// Veggyz data pipeline
// Reads the USDA Local Food Portal bulk exports in data/raw/ and the US cities
// gazetteer, normalises every listing, assigns it to a state + city, computes
// nearby cities, and writes compact JSON that the Next.js pages import.
//
//   pnpm data            → regenerates data/generated/*.json
//
// Raw inputs (not committed, kept in iCloud → VEGGYZ/Data):
//   data/raw/usda-farmersmarket-*.json   bulk export, directory=farmersmarket
//   data/raw/usda-csa-*.json             bulk export, directory=csa
//   data/raw/us_cities.csv               kelvins/US-Cities-Database (MIT)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const RAW = path.join(ROOT, 'data', 'raw')
const OUT = path.join(ROOT, 'data', 'generated')
fs.mkdirSync(OUT, { recursive: true })

// ---------------------------------------------------------------- states ---

export const STATES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  PR: 'Puerto Rico', VI: 'U.S. Virgin Islands', GU: 'Guam',
}
const NAME_TO_ABBR = Object.fromEntries(
  Object.entries(STATES).map(([k, v]) => [v.toLowerCase(), k]),
)
// Alternate spellings that show up in free-text addresses
Object.assign(NAME_TO_ABBR, {
  'washington dc': 'DC', 'washington d.c.': 'DC', 'd.c.': 'DC', 'virgin islands': 'VI',
})

// ------------------------------------------------------------- helpers ---

export function slugify(s) {
  return String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.split('-').map((p) => (p.length ? p[0].toUpperCase() + p.slice(1) : p)).join('-'))
    .join(' ')
    .replace(/\bMc(\w)/g, (_, c) => 'Mc' + c.toUpperCase())
    .replace(/\bSt\b/g, 'St.')
    .replace(/\bMt\b/g, 'Mt.')
    .replace(/\bFt\b/g, 'Ft.')
    .replace(/\bOf\b/g, 'of')
}

function normCity(s) {
  return String(s)
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\bmount\b/g, 'mt')
    .replace(/\bfort\b/g, 'ft')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const R_EARTH_MI = 3958.8
export function haversineMi(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R_EARTH_MI * Math.asin(Math.sqrt(a))
}

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(String(v).trim())
  return Number.isFinite(n) ? n : null
}

function tokens(v) {
  if (!v) return []
  return String(v)
    .split(';')
    .map((t) => t.trim())
    .filter((t) => t && t !== 'nan')
}

function clean(v) {
  if (v === null || v === undefined) return null
  const s = String(v).replace(/\s+/g, ' ').trim()
  if (!s || s === 'nan' || s === 'null' || s === 'None') return null
  return s
}

function firstFile(prefix) {
  const files = fs
    .readdirSync(RAW)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.json'))
    .sort()
  return files.length ? path.join(RAW, files[files.length - 1]) : null
}

// ------------------------------------------------------------ gazetteer ---

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') q = false
      else cur += c
    } else if (c === '"') q = true
    else if (c === ',') { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out
}

function loadGazetteer() {
  const text = fs.readFileSync(path.join(RAW, 'us_cities.csv'), 'utf8')
  const lines = text.split(/\r?\n/).filter(Boolean)
  lines.shift()
  const byState = {}
  for (const line of lines) {
    const [, st, , city, county, lat, lon] = parseCsvLine(line)
    if (!STATES[st]) continue
    ;(byState[st] ||= []).push({
      name: city,
      norm: normCity(city),
      county,
      lat: Number(lat),
      lng: Number(lon),
    })
  }
  for (const st of Object.keys(byState)) byState[st].sort((a, b) => (b.county ? 1 : 0) - (a.county ? 1 : 0))
  return byState
}

function nearestCity(gaz, st, lat, lng, maxMi) {
  const list = gaz[st]
  if (!list || lat == null || lng == null) return null
  let best = null
  let bestD = Infinity
  for (const c of list) {
    const d = haversineMi(lat, lng, c.lat, c.lng)
    if (d < bestD) { bestD = d; best = c }
  }
  return best && bestD <= maxMi ? { ...best, distance: bestD } : null
}

function nearestStateByCoords(gaz, lat, lng) {
  let best = null
  let bestD = Infinity
  for (const st of Object.keys(gaz)) {
    for (const c of gaz[st]) {
      const d = haversineMi(lat, lng, c.lat, c.lng)
      if (d < bestD) { bestD = d; best = st }
    }
  }
  return bestD <= 60 ? best : null
}

// ------------------------------------------------------ address parsing ---

const STATE_ALT = Object.keys(NAME_TO_ABBR)
  .sort((a, b) => b.length - a.length)
  .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|')
const ABBR_ALT = Object.keys(STATES).join('|')
// "..., City, State 12345" | "..., City, ST 12345-6789" | "City State 12345" | "..., City, State"
const RE_TAIL = new RegExp(
  `^(.*?)[,\\s]+(${STATE_ALT}|${ABBR_ALT})\\.?(?:\\s+(${ABBR_ALT}))?\\s*,?\\s*(\\d{5})?(?:-\\d{4})?\\s*,?\\s*(?:usa?|u\\.s\\.a?\\.?|united states)?\\s*$`,
  'i',
)

export function parseAddress(addr) {
  if (!addr) return { rest: null, state: null, zip: null }
  const a = addr.replace(/\s+/g, ' ').trim().replace(/,\s*$/, '')
  const m = a.match(RE_TAIL)
  if (!m) return { rest: a, state: null, zip: null }
  const stRaw = m[2].toLowerCase().replace(/\.$/, '')
  const state = NAME_TO_ABBR[stRaw] || (STATES[stRaw.toUpperCase()] ? stRaw.toUpperCase() : null)
  return { rest: m[1].trim().replace(/,\s*$/, ''), state, zip: m[4] || null }
}

const STATE_PREFIXES = new Set()
for (const n of Object.values(STATES)) for (let i = 1; i < n.length; i++) STATE_PREFIXES.add(n.slice(0, i).toLowerCase())
function junkCity(txt) {
  const t = txt.trim().toLowerCase()
  return t.length < 3 || t === 'us' || t === 'usa' || STATE_PREFIXES.has(t) || /^[a-z]$/.test(t)
}
const STREETY = /\b(parking|behind|corner|ave|avenue|st|street|rd|road|blvd|hwy|highway|downtown|center|centre|lot|plaza|square|hall|church|school|park|entrance|entr|north|south|east|west|block|between|next|across|inside|front|shopping|mall|campus|building|bank|library|marina|shine|until|you|the)\b/i

function cityFromRest(rest, gaz, st) {
  if (!rest) return null
  const parts = rest.split(',').map((p) => p.trim()).filter(Boolean)
  const last = parts[parts.length - 1] || ''
  const gazList = gaz[st] || []
  const find = (txt) => {
    const n = normCity(txt)
    const stripped = n.replace(/^(nw|ne|sw|se|n|s|e|w|north|south|east|west)\s+/, '')
    return gazList.find((c) => c.norm === n) || (stripped !== n ? gazList.find((c) => c.norm === stripped) : undefined)
  }
  // 1. last comma-segment is a clean city (no digits, short, not street-ish) or a gazetteer match
  if (last && !/\d/.test(last) && parts.length > 1) {
    const g = find(last)
    if (g) return { text: g.name, gaz: g }
    // any earlier comma-segment that is a known city (handles "zip, City, Califor" and trailing junk)
    for (let i = parts.length - 2; i >= 0; i--) {
      if (/\d/.test(parts[i])) continue
      const gi = find(parts[i])
      if (gi) return { text: gi.name, gaz: gi }
    }
    const words = last.split(/\s+/)
    if (words.length <= 3 && last.length <= 28 && !STREETY.test(last) && !junkCity(last)) return { text: titleCase(last), gaz: null }
    // street glued onto the city: try trailing windows
    for (let n = Math.min(3, words.length - 1); n >= 1; n--) {
      const g2 = find(words.slice(-n).join(' '))
      if (g2) return { text: g2.name, gaz: g2 }
    }
    return null
  }
  // 2. only one segment or it has digits (street + city glued): try trailing word windows
  const words = last.replace(/[#.]/g, ' ').split(/\s+/).filter(Boolean)
  for (let n = Math.min(4, words.length); n >= 1; n--) {
    const cand = words.slice(-n).join(' ')
    if (/\d/.test(cand)) continue
    const g = find(cand)
    if (g) return { text: g.name, gaz: g }
  }
  // 3. a single short segment without digits or street words is probably just the city
  if (parts.length === 1 && !/\d/.test(last) && last.split(' ').length <= 3 && last.length <= 28 && !STREETY.test(last) && !junkCity(last)) {
    return { text: titleCase(last), gaz: find(last) || null }
  }
  return null
}

// ------------------------------------------------------------ normalise ---

function normaliseCommon(row, kind, gaz, stats) {
  let name = clean(row.listing_name)
  if (!name) { stats.noName++; return null }
  if (name.length > 6 && name === name.toUpperCase() && /[A-Z]{3}/.test(name)) name = titleCase(name).replace(/\bCsa\b/g, 'CSA').replace(/\bYmca\b/g, 'YMCA')
  const address = clean(row.location_address)
  let lat = num(row.location_y)
  let lng = num(row.location_x)
  // sanity: US-ish bounds; swap if someone typed them backwards
  if (lat != null && lng != null && Math.abs(lat) > 90 && Math.abs(lng) <= 90) [lat, lng] = [lng, lat]
  if (lat != null && (lat < 17 || lat > 72 || lng > -64 || lng < -180)) { lat = null; lng = null }

  const parsed = parseAddress(address)
  let state = parsed.state
  if (!state && lat != null) state = nearestStateByCoords(gaz, lat, lng)
  if (!state) { stats.noState++; return null }

  let city = cityFromRest(parsed.rest, gaz, state)
  let cityName = city?.text || null
  let cityGaz = city?.gaz || null
  if (!cityGaz && lat != null) {
    const near = nearestCity(gaz, state, lat, lng, cityName ? 12 : 20)
    if (near && (!cityName || normCity(near.name) === normCity(cityName) || near.distance <= 3)) cityGaz = near
    if (!cityName && near) cityName = near.name
  }
  if (!cityName) { stats.noCity++; return null }
  if (cityGaz) cityName = cityGaz.name
  cityName = cityName.replace(/\s+/g, ' ').trim()

  const fnap = tokens(row.FNAP).map((t) => t.toLowerCase())
  const snap = fnap.some((t) => t.startsWith('snap')) || row.SNAP_option_1 === '1.0' || row.SNAP_option_1 === 1
  const wic = fnap.some((t) => t.includes('wic'))
  const senior = fnap.some((t) => t.includes('senior'))

  return {
    id: String(row.listing_id),
    kind,
    name,
    slug: slugify(name),
    address,
    city: cityName,
    citySlug: slugify(cityName),
    county: cityGaz?.county || null,
    state,
    stateSlug: slugify(STATES[state]),
    zip: parsed.zip,
    lat: lat != null ? Number(lat.toFixed(5)) : null,
    lng: lng != null ? Number(lng.toFixed(5)) : null,
    description: clean(row.listing_desc),
    locationNote: clean(row.location_desc),
    siteType: tokens(row.location_site).map((t) => t.replace(/;$/, '')),
    indoor: clean(row.location_indoor)?.replace(/;$/, '') || null,
    production: tokens(row.specialproductionmethods),
    payment: tokens(row.acceptedpayment).concat(tokens(row.acceptedpayment_7_desc).flatMap((t) => t.split(','))).map((t) => t.trim()).filter(Boolean),
    snap,
    wic,
    senior,
    snapNote: clean(row.SNAP_option)?.replace(/;$/, '') || null,
    incentives: clean(row.FNAP_3_desc),
    onlineOrder: clean(row.saleschannel_onlineorder),
    delivery: tokens(row.saleschannel_deliverymethod),
    csaVendors: clean(row.saleschannel_csa_vendor)?.replace(/;$/, '') || null,
    organizations: tokens(row.orgnization),
    updatedAt: clean(row.update_time)?.slice(0, 10) || null,
  }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function monthName(ym) {
  const m = clean(ym)?.match(/^\d{4}-(\d{2})/)
  return m ? MONTHS[Number(m[1]) - 1] : null
}

function normaliseCsa(row, gaz, stats) {
  const base = normaliseCommon(row, 'csa', gaz, stats)
  if (!base) return null
  const start = monthName(row.season_month_start)
  const end = monthName(row.season_month_end)
  const seasonText = clean(row.season_month)
  const season = start && end ? `${start} to ${end}` : seasonText
  const uniq = (arr) => [...new Set(arr.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean))]
  return {
    ...base,
    season,
    seasonWeeks: num(row.season_weeks),
    seasonNote: clean(row.season_desc),
    vegetables: uniq(tokens(row.product_vegetables)),
    fruit: uniq(tokens(row.product_fruit)),
    otherProducts: [
      ['Poultry', uniq(tokens(row.product_poultryfowl))],
      ['Meat', uniq(tokens(row.product_redmeat))],
      ['Seafood', uniq(tokens(row.product_fishseafood))],
      ['Other', uniq(tokens(row.products_otherdesc))],
    ]
      .filter(([, items]) => items.length)
      .map(([label, items]) => `${label}: ${items.join(', ')}`),
    shareSizes: uniq(tokens(row.share_size)),
    shareCount: num(row.share_number),
    shareContents: clean(row.share_itemsinsharebox)?.replace(/;$/, '') || null,
    paymentPlan: uniq(tokens(row.share_paymentoption)),
    pickup: uniq(tokens(row.deliverpickup_method)),
    farms: num(row.num_supplyfarms),
    yearsOperating: clean(row.continueoperate_year)?.replace(/;$/, '') || null,
  }
}

// ----------------------------------------------------------- aggregate ---

function buildDirectory(kind, rows, gaz) {
  const stats = { input: rows.length, noName: 0, noState: 0, noCity: 0, kept: 0, dedupe: 0 }
  const listings = []
  const seen = new Set()
  for (const row of rows) {
    const l = kind === 'csa' ? normaliseCsa(row, gaz, stats) : normaliseCommon(row, kind, gaz, stats)
    if (!l) continue
    const key = `${l.state}|${l.citySlug}|${slugify(l.name)}|${l.address || ''}`.toLowerCase()
    if (seen.has(key)) { stats.dedupe++; continue }
    seen.add(key)
    listings.push(l)
  }
  // unique slugs within a city
  const slugCount = new Map()
  for (const l of listings) {
    const k = `${l.state}|${l.citySlug}|${l.slug}`
    const n = (slugCount.get(k) || 0) + 1
    slugCount.set(k, n)
    if (n > 1) l.slug = `${l.slug}-${n}`
  }
  stats.kept = listings.length

  // cities
  const cityMap = new Map()
  for (const l of listings) {
    const k = `${l.state}|${l.citySlug}`
    let c = cityMap.get(k)
    if (!c) {
      c = { state: l.state, stateSlug: l.stateSlug, name: l.city, slug: l.citySlug, county: l.county, lat: 0, lng: 0, n: 0, count: 0 }
      cityMap.set(k, c)
    }
    c.count++
    if (l.lat != null) { c.lat += l.lat; c.lng += l.lng; c.n++ }
    if (!c.county && l.county) c.county = l.county
  }
  const cities = [...cityMap.values()].map((c) => ({
    state: c.state,
    stateSlug: c.stateSlug,
    name: c.name,
    slug: c.slug,
    county: c.county,
    lat: c.n ? Number((c.lat / c.n).toFixed(4)) : null,
    lng: c.n ? Number((c.lng / c.n).toFixed(4)) : null,
    count: c.count,
  }))
  // nearby cities (same directory), up to 8 within 40 miles
  for (const c of cities) {
    c.nearby = []
    if (c.lat == null) continue
    const cand = []
    for (const o of cities) {
      if (o === c || o.lat == null) continue
      const d = haversineMi(c.lat, c.lng, o.lat, o.lng)
      if (d <= 40) cand.push({ state: o.state, stateSlug: o.stateSlug, name: o.name, slug: o.slug, count: o.count, mi: Math.round(d) })
    }
    cand.sort((a, b) => a.mi - b.mi)
    c.nearby = cand.slice(0, 8)
  }
  cities.sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name))

  // states
  const states = Object.keys(STATES)
    .map((abbr) => {
      const cs = cities.filter((c) => c.state === abbr)
      const count = cs.reduce((s, c) => s + c.count, 0)
      return { abbr, name: STATES[abbr], slug: slugify(STATES[abbr]), count, cities: cs.length }
    })
    .filter((s) => s.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  listings.sort((a, b) => a.state.localeCompare(b.state) || a.citySlug.localeCompare(b.citySlug) || a.name.localeCompare(b.name))
  return { listings, cities, states, stats }
}

// ---------------------------------------------------------------- main ---

const gaz = loadGazetteer()
const summary = {}
for (const kind of ['farmers-markets', 'csa']) {
  const prefix = kind === 'csa' ? 'usda-csa-' : 'usda-farmersmarket-'
  const file = firstFile(prefix)
  if (!file) {
    console.warn(`! no raw file for ${kind} (expected ${prefix}*.json in data/raw) — writing empty dataset`)
    fs.writeFileSync(path.join(OUT, `${kind}.json`), JSON.stringify({ listings: [], cities: [], states: [], stats: {} }))
    summary[kind] = { source: null }
    continue
  }
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'))
  const dir = buildDirectory(kind, rows, gaz)
  fs.writeFileSync(path.join(OUT, `${kind}.json`), JSON.stringify(dir))
  summary[kind] = { source: path.basename(file), ...dir.stats, cities: dir.cities.length, states: dir.states.length }
  console.log(kind, summary[kind])
}
// compact search index: every city in both directories
const index = []
for (const kind of ['farmers-markets', 'csa']) {
  const d = JSON.parse(fs.readFileSync(path.join(OUT, `${kind}.json`), 'utf8'))
  for (const c of d.cities) index.push([kind === 'csa' ? 'c' : 'f', c.state, c.name, c.slug, c.stateSlug, c.count])
}
fs.writeFileSync(path.join(ROOT, 'public', 'search-index.json'), JSON.stringify(index))
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify({ generatedAt: new Date().toISOString(), ...summary }, null, 2))
console.log('search index entries:', index.length)
