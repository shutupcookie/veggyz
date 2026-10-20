import Link from '@/components/site/link'
import { VeggyzLockup } from '@/components/brand/logo'
import { site } from '@/lib/site'

const cols = [
  {
    title: 'Find',
    links: [
      { href: '/farmers-markets/', label: 'Farmers markets by state' },
      { href: '/csa/', label: 'CSA farms by state' },
      { href: '/recipes/', label: 'Quick vegetarian recipes' },
      { href: '/best/', label: 'Delivery guides' },
    ],
  },
  {
    title: 'Veggyz',
    links: [
      { href: '/about/', label: 'About' },
      { href: '/affiliate-disclosure/', label: 'How we make money' },
      { href: '/privacy/', label: 'Privacy' },
      { href: `mailto:${site.email}`, label: site.email },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-beet text-husk">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="flex flex-col gap-4">
          <VeggyzLockup variant="reverse" className="text-3xl" />
          <p className="max-w-sm text-sm leading-relaxed text-husk/75 text-pretty">
            Real vegetables, near you. Market and CSA listings come from the{' '}
            <a href={site.dataSource.url} className="underline decoration-lime/60 underline-offset-4 hover:text-lime" rel="noopener">
              {site.dataSource.name}
            </a>{' '}
            and are refreshed by hand. Spotted a market that moved or closed? Tell us and we&rsquo;ll fix it.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="font-display text-lg font-bold text-lime">{c.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-husk/80 hover:text-lime">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-husk/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-husk/60 md:flex-row md:items-center md:justify-between md:px-8">
          <p>&copy; {new Date().getFullYear()} Veggyz. Some links on delivery guides are affiliate links.</p>
          <p className="font-display text-base font-extrabold text-husk">eat your veggy<span className="text-carrot">z</span>.</p>
        </div>
      </div>
    </footer>
  )
}
