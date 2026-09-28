'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// [kind, state, name, slug, stateSlug, count]
type Entry = ['f' | 'c', string, string, string, string, number]

let cache: Entry[] | null = null
async function loadIndex() {
  if (cache) return cache
  const res = await fetch('/search-index.json')
  cache = (await res.json()) as Entry[]
  return cache
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function SearchBox({
  kind,
  placeholder = 'City or town, e.g. Austin',
  className,
  onDark = false,
}: {
  kind?: 'f' | 'c'
  placeholder?: string
  className?: string
  onDark?: boolean
}) {
  const [q, setQ] = useState('')
  const [index, setIndex] = useState<Entry[] | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useRef(`sb-${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    if (q.length >= 2 && !index) loadIndex().then(setIndex)
  }, [q, index])

  const results = useMemo(() => {
    if (!index || q.trim().length < 2) return []
    const nq = norm(q)
    const parts = nq.split(' ')
    const scored: { e: Entry; s: number }[] = []
    for (const e of index) {
      if (kind && e[0] !== kind) continue
      const name = norm(e[2])
      const st = e[1].toLowerCase()
      let s = 0
      if (name === nq) s = 100
      else if (name.startsWith(nq)) s = 80
      else if (parts.length > 1 && name.startsWith(parts[0]) && (st === parts[parts.length - 1] || name.includes(parts[1]))) s = 70
      else if (name.includes(nq)) s = 40
      if (s) scored.push({ e, s: s + Math.min(e[5], 20) / 20 })
    }
    scored.sort((a, b) => b.s - a.s || b.e[5] - a.e[5])
    return scored.slice(0, 8).map((x) => x.e)
  }, [index, q, kind])

  function href(e: Entry) {
    return `${e[0] === 'c' ? '/csa' : '/farmers-markets'}/${e[4]}/${e[3]}/`
  }

  return (
    <div className={cn('relative', className)}>
      <label className="sr-only" htmlFor={`${listId.current}-input`}>
        Search by city
      </label>
      <div
        className={cn(
          'flex items-center gap-2 rounded-full border px-4 py-2.5',
          onDark ? 'border-husk/25 bg-husk text-soil' : 'border-border bg-surface text-soil',
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          id={`${listId.current}-input`}
          type="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId.current}
          aria-autocomplete="list"
          value={q}
          placeholder={placeholder}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
            if (e.key === 'Enter' && results[active]) window.location.href = href(results[active])
            if (e.key === 'Escape') setOpen(false)
          }}
          className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>
      {open && results.length > 0 && (
        <ul
          id={listId.current}
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-surface py-1 text-left text-soil shadow-lg"
        >
          {results.map((e, i) => (
            <li key={`${e[0]}-${e[4]}-${e[3]}`} role="option" aria-selected={i === active}>
              <a
                href={href(e)}
                onMouseEnter={() => setActive(i)}
                className={cn('flex items-center justify-between gap-3 px-4 py-2 text-sm', i === active && 'bg-muted')}
              >
                <span>
                  <span className="font-semibold">{e[2]}</span>, {e[1]}
                  <span className="ml-2 text-xs uppercase tracking-wide text-muted-foreground">{e[0] === 'c' ? 'CSA' : 'Markets'}</span>
                </span>
                <span className="text-muted-foreground">{e[5]}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {open && q.trim().length >= 2 && index && results.length === 0 && (
        <p className={cn('absolute left-0 right-0 mt-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-soil shadow-lg')}>
          Nothing for &ldquo;{q}&rdquo; yet. Try the nearest bigger town, or browse by state below.
        </p>
      )}
    </div>
  )
}
