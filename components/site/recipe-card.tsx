import Link from '@/components/site/link'
import { Clock } from 'lucide-react'

/** The slice of a recipe a card needs; kept small so it can be passed to client components. */
export interface RecipeSummary {
  href: string
  title: string
  spin: string
  minutes: number
  equipment: string[]
  equipmentLabels: string[]
  diets: string[]
  collection: string
  collectionTitle: string
  protein: string
}

export function RecipeCard({ r, showCollection = false }: { r: RecipeSummary; showCollection?: boolean }) {
  const vegan = r.diets.includes('vegan')
  return (
    <Link
      href={r.href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-[border-color,transform] hover:-translate-y-0.5 hover:border-beet"
    >
      <div className="relative flex items-end justify-between gap-3 bg-beet px-5 pb-4 pt-5 text-husk">
        <span className="flex items-baseline gap-1 font-display font-extrabold leading-none text-lime">
          <span className="text-5xl tracking-tight">{r.minutes}</span>
          <span className="text-lg">min</span>
        </span>
        <span className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-husk/70">
          {showCollection ? r.collectionTitle : r.equipmentLabels.join(' · ')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold leading-tight text-beet text-balance group-hover:underline group-hover:decoration-beet/30 group-hover:underline-offset-4">
          {r.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{r.spin}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5">
            <Clock className="size-3" aria-hidden /> {r.minutes} min
          </span>
          <span className="rounded-full bg-muted px-2.5 py-0.5">{vegan ? 'Vegan' : 'Vegetarian'}</span>
          {r.diets.includes('gluten-free') && <span className="rounded-full bg-muted px-2.5 py-0.5">Gluten-free</span>}
          <span className="rounded-full bg-muted px-2.5 py-0.5 capitalize">{r.protein}</span>
        </div>
      </div>
    </Link>
  )
}
