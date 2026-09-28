import { SectionHeading } from './section-heading'

const pairs = [
  { say: 'Crunch time. Your carrots land Tuesday.', avoid: 'Your order has been dispatched.' },
  { say: 'Ugly on the outside. Great in a soup.', avoid: 'Imperfect produce now available at a discount.' },
  { say: 'Grown 40 miles away. Picked yesterday.', avoid: 'Locally sourced, farm-fresh goodness!!' },
  { say: 'Skip a week? No drama.', avoid: 'Subscription modifications may incur changes.' },
]

export function VoiceSection() {
  return (
    <section id="voice" className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="Voice" title="Talk like a friend at the market.">
        Warm, quick and specific. Lead with the veg, keep it short, and let one playful word do the
        heavy lifting. Always lowercase “veggyz” in the logo; “Veggyz” in running text.
      </SectionHeading>

      <div className="overflow-hidden rounded-3xl border border-border">
        <div className="grid grid-cols-2 bg-muted text-sm font-medium">
          <p className="px-5 py-4 text-beet md:px-8">Say this</p>
          <p className="px-5 py-4 text-carrot md:px-8">Not this</p>
        </div>
        <ul className="divide-y divide-border">
          {pairs.map((p) => (
            <li key={p.say} className="grid grid-cols-2">
              <p className="px-5 py-6 font-display text-lg font-bold leading-snug text-beet md:px-8 md:text-2xl">
                {p.say}
              </p>
              <p className="px-5 py-6 leading-relaxed text-muted-foreground line-through decoration-carrot/60 md:px-8">
                {p.avoid}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
