'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { RecipeCard, type RecipeSummary } from './recipe-card'

type Time = 'any' | '15' | '20' | '30'
type Gear = 'any' | 'air-fryer' | 'stovetop' | 'no-cook' | 'oven'
type Diet = 'any' | 'vegan' | 'gluten-free'

const times: [Time, string][] = [['any', 'Any time'], ['15', '15 min or less'], ['20', '20 min or less'], ['30', '30 min or less']]
const gears: [Gear, string][] = [['any', 'Any gear'], ['air-fryer', 'Air fryer'], ['stovetop', 'Stovetop'], ['oven', 'Oven'], ['no-cook', 'No cooking']]
const diets: [Diet, string][] = [['any', 'Vegetarian'], ['vegan', 'Vegan'], ['gluten-free', 'Gluten-free']]

function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
            value === v ? 'border-beet bg-beet text-lime' : 'border-border bg-surface hover:border-beet',
          )}
        >
          {l}
        </button>
      ))}
    </fieldset>
  )
}

export function RecipeFilter({ recipes }: { recipes: RecipeSummary[] }) {
  const [time, setTime] = useState<Time>('any')
  const [gear, setGear] = useState<Gear>('any')
  const [diet, setDiet] = useState<Diet>('any')

  const shown = useMemo(
    () =>
      recipes.filter(
        (r) =>
          (time === 'any' || r.minutes <= Number(time)) &&
          (gear === 'any' || r.equipment.includes(gear)) &&
          (diet === 'any' || r.diets.includes(diet)),
      ),
    [recipes, time, gear, diet],
  )

  return (
    <div>
      <div className="grid gap-3 rounded-3xl border border-border bg-surface p-4 md:p-5">
        <Chips label="Time" options={times} value={time} onChange={setTime} />
        <Chips label="Equipment" options={gears} value={gear} onChange={setGear} />
        <Chips label="Diet" options={diets} value={diet} onChange={setDiet} />
      </div>
      <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
        {shown.length === recipes.length ? `All ${recipes.length} recipes` : `${shown.length} of ${recipes.length} recipes`}
      </p>
      {shown.length ? (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <li key={r.href}>
              <RecipeCard r={r} showCollection />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl bg-muted px-5 py-4">Nothing matches all three. Loosen one filter and try again.</p>
      )}
    </div>
  )
}
