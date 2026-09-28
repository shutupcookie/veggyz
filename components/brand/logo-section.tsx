import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'
import { VeggyzLockup, VeggyzMark, type LogoVariant } from './logo'

const tiles: {
  label: string
  note: string
  variant: LogoVariant
  bg: string
  text: string
  stacked?: boolean
  markOnly?: boolean
  span?: string
}[] = [
  {
    label: 'Primary',
    note: 'Default on Husk and light backgrounds.',
    variant: 'primary',
    bg: 'bg-husk border border-border',
    text: 'text-muted-foreground',
    span: 'md:col-span-2',
  },
  {
    label: 'Reverse',
    note: 'On Beet. Our most recognisable look.',
    variant: 'reverse',
    bg: 'bg-beet',
    text: 'text-husk/75',
  },
  {
    label: 'Stacked',
    note: 'For square formats and packaging lids.',
    variant: 'primary',
    bg: 'bg-lime',
    text: 'text-soil/70',
    stacked: true,
  },
  {
    label: 'Mono',
    note: 'Single-colour print, stamps and embossing.',
    variant: 'mono-light',
    bg: 'bg-soil',
    text: 'text-husk/70',
  },
  {
    label: 'The Sprout mark',
    note: 'Two leaves forming a V. Favicons, stickers, app icon.',
    variant: 'primary',
    bg: 'bg-carrot',
    text: 'text-soil/75',
    markOnly: true,
  },
]

const donts = [
  { label: 'Don’t stretch', className: 'scale-x-150' },
  { label: 'Don’t recolour', className: 'hue-rotate-180' },
  { label: 'Don’t rotate', className: '-rotate-12' },
  { label: 'Don’t add effects', className: 'drop-shadow-[0_6px_0_var(--carrot)] blur-[0.5px]' },
]

export function LogoSection() {
  return (
    <section id="logo" className="bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Logo" title="Two leaves, one grin.">
            The Sprout mark is two leaves meeting at the root to form a V. The right leaf always
            shares its colour with the z in the wordmark, tying the symbol and the name together.
          </SectionHeading>
          <div className="flex flex-wrap gap-3">
            <a
              href="/brand/veggyz-logo-pack.zip"
              download
              className="inline-flex items-center gap-2 rounded-full bg-beet px-5 py-3 text-sm font-medium text-husk transition-opacity hover:opacity-90"
            >
              <Download className="size-4" aria-hidden />
              Full logo pack (SVG)
            </a>
            <a
              href="/brand/veggyz-mark.svg"
              download
              className="inline-flex items-center gap-2 rounded-full border border-beet px-5 py-3 text-sm font-medium text-beet transition-colors hover:bg-beet hover:text-husk"
            >
              <Download className="size-4" aria-hidden />
              Mark SVG
            </a>
            <a
              href="/brand/veggyz-app-icon.svg"
              download
              className="inline-flex items-center gap-2 rounded-full border border-beet px-5 py-3 text-sm font-medium text-beet transition-colors hover:bg-beet hover:text-husk"
            >
              <Download className="size-4" aria-hidden />
              App icon SVG
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tiles.map((t) => (
            <figure
              key={t.label}
              className={cn(
                'flex min-h-64 flex-col justify-between gap-8 rounded-3xl p-6',
                t.bg,
                t.span,
              )}
            >
              <div className="flex flex-1 items-center justify-center">
                {t.markOnly ? (
                  <div className="flex items-center gap-6">
                    <VeggyzMark variant="primary" className="size-24" label="Veggyz mark" />
                    <div className="flex size-24 items-center justify-center rounded-3xl bg-beet">
                      <VeggyzMark variant="reverse" className="size-16" label="Veggyz app icon" />
                    </div>
                  </div>
                ) : (
                  <VeggyzLockup
                    variant={t.variant}
                    stacked={t.stacked}
                    className={t.span ? 'text-7xl md:text-8xl' : 'text-6xl'}
                  />
                )}
              </div>
              <figcaption className={cn('flex flex-col gap-1 text-sm', t.text)}>
                <span className="font-medium">{t.label}</span>
                <span>{t.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-husk p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold text-beet">Clear space & sizing</h3>
            <div className="flex justify-center py-4">
              <div className="relative rounded-md border-2 border-dashed border-carrot p-8 text-5xl md:p-10 md:text-6xl">
                <VeggyzLockup variant="primary" />
                <span className="absolute left-1/2 top-1 -translate-x-1/2 text-xs font-medium text-carrot">
                  x
                </span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-medium text-carrot">
                  x
                </span>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="font-medium text-soil">Clear space:</strong> keep a margin of x
                on every side, where x is the height of the z.
              </li>
              <li>
                <strong className="font-medium text-soil">Minimum size:</strong> lockup 96px / 25mm
                wide. Mark alone 16px / 5mm.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-husk p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold text-beet">Please don&apos;t</h3>
            <ul className="grid grid-cols-2 gap-3">
              {donts.map((d) => (
                <li
                  key={d.label}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-muted p-5"
                >
                  <div className="relative flex h-16 items-center justify-center overflow-hidden text-3xl">
                    <span className={cn('inline-block', d.className)}>
                      <VeggyzLockup variant="primary" />
                    </span>
                  </div>
                  <span className="text-sm font-medium text-carrot">{d.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
