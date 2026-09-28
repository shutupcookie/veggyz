import Link from '@/components/site/link'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  name: string
  path: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={it.path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-foreground">
                  {it.name}
                </span>
              ) : (
                <Link href={it.path} className="hover:text-beet hover:underline underline-offset-4">
                  {it.name}
                </Link>
              )}
              {!last && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
