'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

const colours = [
  {
    name: 'Beet',
    hex: '#5A1236',
    rgb: '90 · 18 · 54',
    cmyk: '0 · 80 · 40 · 65',
    role: 'Primary. Backgrounds, wordmark, headlines.',
    share: 45,
    swatch: 'bg-beet text-husk',
  },
  {
    name: 'Husk',
    hex: '#F6F4EC',
    rgb: '246 · 244 · 236',
    cmyk: '2 · 2 · 6 · 0',
    role: 'Canvas. Paper, packaging, UI backgrounds.',
    share: 30,
    swatch: 'bg-husk text-soil border border-border',
  },
  {
    name: 'Lime',
    hex: '#B1FF2D',
    rgb: '177 · 255 · 45',
    cmyk: '31 · 0 · 82 · 0',
    role: 'Highlight. Stickers, badges, buttons on Beet.',
    share: 12,
    swatch: 'bg-lime text-soil',
  },
  {
    name: 'Carrot',
    hex: '#FF6B2C',
    rgb: '255 · 107 · 44',
    cmyk: '0 · 70 · 90 · 0',
    role: 'Spark. The z, promos, price tags. Sparingly.',
    share: 8,
    swatch: 'bg-carrot text-soil',
  },
  {
    name: 'Soil',
    hex: '#1A1A17',
    rgb: '26 · 26 · 23',
    cmyk: '70 · 65 · 70 · 80',
    role: 'Body text and fine detail.',
    share: 5,
    swatch: 'bg-soil text-husk',
  },
]

export function ColourSection() {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(hex: string) {
    await navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <section id="colour" className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="Colour" title="Picked this morning.">
        Five colours pulled straight from the veg drawer. Deep Beet leads where every other veg brand
        reaches for forest green, Husk gives it room to breathe, and electric Lime and Carrot bring the
        crunch. Green is a spark here, never the base. Click any swatch to copy its hex.
      </SectionHeading>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {colours.map((c) => (
          <li key={c.name}>
            <button
              type="button"
              onClick={() => copy(c.hex)}
              className={cn(
                'flex h-full min-h-72 w-full flex-col justify-between gap-6 rounded-3xl p-5 text-left transition-transform hover:-translate-y-1',
                c.swatch,
              )}
              aria-label={`Copy ${c.name} ${c.hex}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-3xl font-extrabold tracking-tight">{c.name}</span>
                {copied === c.hex ? (
                  <Check className="size-4 shrink-0" aria-hidden />
                ) : (
                  <Copy className="size-4 shrink-0 opacity-60" aria-hidden />
                )}
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <p className="leading-relaxed opacity-80">{c.role}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-medium tabular-nums">
                  <dt className="opacity-60">HEX</dt>
                  <dd>{c.hex}</dd>
                  <dt className="opacity-60">RGB</dt>
                  <dd>{c.rgb}</dd>
                  <dt className="opacity-60">CMYK</dt>
                  <dd>{c.cmyk}</dd>
                </dl>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {copied ? `Copied ${copied}` : ''}
      </p>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-2xl font-bold text-beet">Balance</h3>
        <div className="flex h-16 w-full overflow-hidden rounded-2xl border border-border" aria-hidden>
          {colours.map((c) => (
            <div key={c.name} className={cn(c.swatch, 'border-0')} style={{ width: `${c.share}%` }} />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {colours.map((c) => (
            <li key={c.name}>
              <span className="font-medium text-soil">{c.name}</span> {c.share}%
            </li>
          ))}
        </ul>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Accessibility: set body text in Soil on Husk or Husk on Beet. Carrot and Lime are for
          large type, shapes and highlights, never for small text on Husk.
        </p>
      </div>
    </section>
  )
}
