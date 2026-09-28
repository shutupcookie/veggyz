import { VeggyzLockup } from './logo'

const nav = [
  { href: '#essence', label: 'Essence' },
  { href: '#logo', label: 'Logo' },
  { href: '#colour', label: 'Colour' },
  { href: '#type', label: 'Type' },
  { href: '#voice', label: 'Voice' },
  { href: '#applications', label: 'In use' },
]

export function Hero() {
  return (
    <header className="bg-beet text-husk">
      <nav
        aria-label="Guideline sections"
        className="mx-auto flex max-w-6xl items-center justify-end gap-6 border-t border-husk/10 px-5 py-4 md:px-8"
      >
        <ul className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-husk/75 transition-colors hover:text-lime focus-visible:text-lime"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <p className="text-sm uppercase tracking-widest text-husk/70">
          Brand guidelines · Version 1.0 · 2026
        </p>
        <h1 className="text-[clamp(4.5rem,17vw,14rem)]">
          <VeggyzLockup variant="reverse" />
        </h1>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="font-display text-4xl font-extrabold tracking-tight text-lime md:text-6xl">
            Eat your veggyz.
          </p>
          <p className="max-w-sm leading-relaxed text-husk/80 text-pretty">
            Real vegetables, near you. This page is the single source of truth for how Veggyz looks,
            sounds and shows up in the world.
          </p>
        </div>
      </div>
    </header>
  )
}
