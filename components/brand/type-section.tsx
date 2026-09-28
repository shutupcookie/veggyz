const scale = [
  { name: 'Display', spec: '96 / 90% · ExtraBold', className: 'font-display text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9]', sample: 'crunch time' },
  { name: 'Headline', spec: '56 / 100% · ExtraBold', className: 'font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-none', sample: 'Picked yesterday.' },
  { name: 'Title', spec: '28 / 120% · Bold', className: 'font-display text-2xl md:text-3xl font-bold', sample: 'This week’s box' },
  { name: 'Body', spec: '16 / 160% · Regular', className: 'font-sans text-base leading-relaxed', sample: 'Rainbow chard, sugar snaps and the sweetest carrots we’ve tasted all year, from Hollow Oak Farm.' },
  { name: 'Caption', spec: '14 / 150% · Medium', className: 'font-sans text-sm font-medium', sample: 'Grown 40 miles away · £18 per box' },
]

export function TypeSection() {
  return (
    <section id="type" className="bg-beet text-husk">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-20 md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-widest text-husk/70">Typography</p>
          <h2 className="font-display text-4xl font-extrabold leading-none tracking-tight text-lime text-balance md:text-6xl">
            Chunky on top, easy underneath.
          </h2>
          <p className="text-lg leading-relaxed text-husk/80 text-pretty">
            Two free Google Fonts. Bricolage Grotesque brings the personality with its slightly
            wonky, inky curves. DM Sans keeps everything else calm and readable.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 rounded-3xl bg-husk p-6 text-soil md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Display & headlines</span>
              <span className="text-sm text-muted-foreground">600–800</span>
            </div>
            <p className="font-display text-9xl font-extrabold leading-none tracking-tight text-beet">
              Aa
            </p>
            <div className="flex flex-col gap-2">
              <p className="font-display text-3xl font-bold text-beet">Bricolage Grotesque</p>
              <p className="font-display text-lg text-muted-foreground break-all">
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-10 rounded-3xl bg-lime p-6 text-soil md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-soil/70">Body & interface</span>
              <span className="text-sm text-soil/70">400–600</span>
            </div>
            <p className="font-sans text-9xl font-medium leading-none tracking-tight">Aa</p>
            <div className="flex flex-col gap-2">
              <p className="font-sans text-3xl font-semibold">DM Sans</p>
              <p className="font-sans text-lg text-soil/70 break-all">
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-husk/15 border-y border-husk/15">
          {scale.map((s) => (
            <div key={s.name} className="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-10">
              <div className="flex shrink-0 flex-col gap-1 text-sm md:w-48">
                <span className="font-medium text-lime">{s.name}</span>
                <span className="text-husk/60">{s.spec}</span>
              </div>
              <p className={s.className}>{s.sample}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
