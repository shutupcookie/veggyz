import type { Metadata } from 'next'
import { Hero } from '@/components/brand/hero'
import { Essence } from '@/components/brand/essence'
import { LogoSection } from '@/components/brand/logo-section'
import { ColourSection } from '@/components/brand/colour-section'
import { TypeSection } from '@/components/brand/type-section'
import { VoiceSection } from '@/components/brand/voice-section'
import { Applications } from '@/components/brand/applications'
import { pageMeta } from '@/lib/seo'

// Internal brand reference. Kept at /brand and excluded from search engines.
export const metadata: Metadata = pageMeta({
  title: 'Veggyz brand guidelines',
  description: 'Logo, colour palette, typography and voice for Veggyz.',
  path: '/brand/',
  noindex: true,
})

export default function Page() {
  return (
    <>
      <Hero />
      <main>
        <Essence />
        <LogoSection />
        <ColourSection />
        <TypeSection />
        <VoiceSection />
        <Applications />
      </main>
    </>
  )
}
