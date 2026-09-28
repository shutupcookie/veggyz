import Link from '@/components/site/link'
import { VeggyzLockup } from '@/components/brand/logo'
import { nav } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="bg-beet text-husk">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-lime focus:px-3 focus:py-2 focus:text-soil"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="text-2xl" aria-label="Veggyz home">
          <VeggyzLockup variant="reverse" />
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-husk/80 transition-colors hover:text-lime focus-visible:text-lime"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
