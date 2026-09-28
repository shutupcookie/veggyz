import Image from 'next/image'
import { SectionHeading } from './section-heading'
import { VeggyzLockup, VeggyzMark, VeggyzWordmark } from './logo'

function Sticker() {
  return (
    <div className="flex size-20 items-center justify-center rounded-full bg-husk shadow-lg md:size-24">
      <VeggyzMark className="size-11 md:size-14" label="Veggyz sticker" />
    </div>
  )
}

export function Applications() {
  return (
    <section id="applications" className="bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-20 md:px-8 md:py-28">
        <SectionHeading eyebrow="In use" title="Out in the wild.">
          Real produce always does the talking. The logo sits on it like a sticker slapped on at
          the market stall: confident, a little off-grid, never covering the good stuff.
        </SectionHeading>

        <div className="grid gap-4 md:grid-cols-6">
          <figure className="relative overflow-hidden rounded-3xl md:col-span-4 md:row-span-2">
            <Image
              src="/brand/box.png"
              alt="Kraft delivery box sealed with beet-coloured tape, full of beetroot, carrots and radishes"
              width={1200}
              height={1200}
              className="h-full min-h-80 w-full object-cover"
            />
            <div className="absolute right-5 top-5 rotate-12">
              <Sticker />
            </div>
            <figcaption className="absolute bottom-5 left-5 rounded-full bg-beet px-4 py-2 text-sm font-medium text-husk">
              Weekly delivery box
            </figcaption>
          </figure>

          <figure className="relative overflow-hidden rounded-3xl md:col-span-2">
            <Image
              src="/brand/tote.png"
              alt="Deep beet canvas tote bag filled with carrots and celery"
              width={800}
              height={800}
              className="aspect-square h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-husk px-4 py-2 text-sm font-medium text-beet">
              Market tote
            </figcaption>
          </figure>

          <div className="flex aspect-square flex-col justify-between gap-8 rounded-3xl bg-beet p-6 md:col-span-2 md:aspect-auto">
            <VeggyzLockup variant="reverse" className="text-4xl" />
            <div className="flex flex-col gap-1 text-sm text-husk/80">
              <p className="font-display text-xl font-bold text-husk">Maya Okafor</p>
              <p>Head Grower Wrangler</p>
              <p className="text-lime">hello@veggyz.com</p>
            </div>
          </div>

          <figure className="relative overflow-hidden rounded-3xl md:col-span-6">
            <Image
              src="/brand/flatlay.png"
              alt="Colourful vegetables arranged in a grid on lime green paper"
              width={1600}
              height={900}
              className="aspect-[4/3] w-full object-cover md:aspect-[21/9]"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 md:p-10">
              <p className="w-fit rounded-2xl bg-husk px-5 py-3 font-display text-4xl font-extrabold leading-none tracking-tight text-beet md:text-7xl">
                eat your <VeggyzWordmark />.
              </p>
            </div>
            <figcaption className="sr-only">Social campaign poster</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
