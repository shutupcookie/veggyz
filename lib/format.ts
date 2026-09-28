export function plural(n: number, one: string, many = `${one}s`) {
  return `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`
}

export function mapsUrl(l: { name: string; address: string | null; lat: number | null; lng: number | null }) {
  const q = l.address ? `${l.name}, ${l.address}` : l.lat != null ? `${l.lat},${l.lng}` : l.name
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

export function joinNatural(items: string[]) {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

export function formatDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/** Clean up USDA free-text quirks: doubled spaces, trailing separators, ALL CAPS shouting */
export function tidy(s: string | null | undefined) {
  if (!s) return null
  let t = s.replace(/\s+/g, ' ').replace(/[;,\s]+$/g, '').trim()
  if (t.length > 12 && t === t.toUpperCase()) {
    t = t.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase())
  }
  return t
}

export function truncate(s: string, max = 160) {
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 60)) + '…'
}
