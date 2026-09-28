import { cn } from '@/lib/utils'

export type LogoVariant = 'primary' | 'reverse' | 'mono-dark' | 'mono-light'

const variants: Record<
  LogoVariant,
  { left: string; right: string; word: string; z: string }
> = {
  primary: { left: 'var(--beet)', right: 'var(--carrot)', word: 'text-beet', z: 'text-carrot' },
  reverse: { left: 'var(--husk)', right: 'var(--lime)', word: 'text-husk', z: 'text-lime' },
  'mono-dark': { left: 'var(--beet)', right: 'var(--beet)', word: 'text-beet', z: 'text-beet' },
  'mono-light': { left: 'var(--husk)', right: 'var(--husk)', word: 'text-husk', z: 'text-husk' },
}

export const LEAF_LEFT = 'M31 58C13 51 3 31 7 7c19 4 28 24 24 51Z'
export const LEAF_RIGHT = 'M33 58c18-7 28-27 24-51-19 4-28 24-24 51Z'

export function VeggyzMark({
  variant = 'primary',
  className,
  label,
}: {
  variant?: LogoVariant
  className?: string
  label?: string
}) {
  const v = variants[variant]
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={LEAF_LEFT} fill={v.left} />
      <path d={LEAF_RIGHT} fill={v.right} />
    </svg>
  )
}

export function VeggyzWordmark({
  variant = 'primary',
  className,
}: {
  variant?: LogoVariant
  className?: string
}) {
  const v = variants[variant]
  return (
    <span
      className={cn(
        'font-display font-extrabold leading-none tracking-[-0.045em]',
        v.word,
        className,
      )}
    >
      vegg<span>y</span>
      <span className={v.z}>z</span>
    </span>
  )
}

export function VeggyzLockup({
  variant = 'primary',
  stacked = false,
  className,
}: {
  variant?: LogoVariant
  stacked?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        stacked ? 'flex-col gap-[0.12em]' : 'gap-[0.14em]',
        className,
      )}
      aria-label="Veggyz"
      role="img"
    >
      <VeggyzMark variant={variant} className="h-[0.9em] w-[0.9em] shrink-0" />
      <VeggyzWordmark variant={variant} className="-translate-y-[0.06em]" />
    </span>
  )
}
