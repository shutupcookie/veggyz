import { cn } from '@/lib/utils'

type Tone = 'lime' | 'beet' | 'neutral' | 'carrot' | 'outline'

const tones: Record<Tone, string> = {
  // Lime only ever sits on Beet (contrast rule); on Husk we use Beet fills.
  lime: 'bg-beet text-lime',
  beet: 'bg-beet text-husk',
  neutral: 'bg-muted text-foreground',
  carrot: 'bg-carrot/15 text-beet',
  // For use on Beet backgrounds
  outline: 'border border-husk/40 text-husk',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
