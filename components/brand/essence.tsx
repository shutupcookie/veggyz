import { SectionHeading } from './section-heading'

const traits = [
  {
    name: 'Fresh',
    body: 'Bright, crisp, never stale. Short sentences, lots of air, real produce front and centre.',
  },
  {
    name: 'Cheeky',
    body: 'A wink, not a stand-up routine. One playful line per message is plenty.',
  },
  {
    name: 'Honest',
    body: 'Where it grew, who grew it, what it costs. No greenwashing, no fine print.',
  },
]

export function Essence() {
  return (
    <section id="essence" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <SectionHeading eyebrow="Brand essence" title="Veggies, plus a z for zest.">
          Veggyz makes eating vegetables feel like a treat, not a chore. The name is the brief: the
          familiar word everyone knows, bent into something friendlier, faster and a little bit
          mischievous.
        </SectionHeading>

        <dl className="flex flex-col divide-y divide-border border-y border-border">
          {traits.map((t) => (
            <div key={t.name} className="flex flex-col gap-2 py-6 md:flex-row md:gap-8">
              <dt className="font-display text-2xl font-bold text-beet md:w-32 md:shrink-0">
                {t.name}
              </dt>
              <dd className="leading-relaxed text-muted-foreground">{t.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
