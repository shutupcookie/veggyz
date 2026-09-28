import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { Container, PageHero } from '@/components/site/page-shell'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'How Veggyz makes money',
  description: 'Veggyz is free to use. Some links in our delivery guides are affiliate links that pay us a referral fee. Here is exactly how that works and what it does not change.',
  path: '/affiliate-disclosure/',
})

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Affiliate disclosure" title="How we make money" lede="Short version: the directory is free and always will be. Some links in the delivery guides pay us a fee if you sign up. That fee never changes what we recommend." crumbs={[{ name: 'Home', path: '/' }, { name: 'How we make money', path: '/affiliate-disclosure/' }]} />
      <Container className="py-12 md:py-16">
        <div className="prose-veggyz max-w-3xl">
          <h2>The directory</h2>
          <p>
            Farmers market and CSA listings are free to browse, free to be listed in, and carry no advertising. Nobody can pay to move up a list. Listings are sorted alphabetically, and nearby towns are sorted by distance.
          </p>
          <h2>The delivery guides</h2>
          <p>
            Our guides to <Link href="/best/">meal delivery, meal kits, produce boxes and planning apps</Link> contain links to those services. Where a service runs an affiliate program and has accepted us, the link is an affiliate link: if you click it and sign up, the service pays Veggyz a referral fee. It costs you nothing extra, and the price you pay is the same as if you had typed the address yourself.
          </p>
          <p>
            Affiliate links are marked with <code>rel=&quot;sponsored&quot;</code> in the page code, as search engines ask, and each guide says at the top whether it contains any. Today, the guides link to services directly; as programs accept us we will switch those links and update this page.
          </p>
          <h2>What the fee does not change</h2>
          <p>
            The order of a guide, the verdict on each service and the prices we print are decided before we know whether a service pays a fee, and are not revised when one does. Several services we rank highly have no affiliate program at all. When a service we earn from gets worse, the guide says so.
          </p>
          <h2>What we do not do</h2>
          <p>
            We do not sell placements, accept free products in exchange for reviews, run display advertising or sell your data. The site has no accounts, so there is nothing to sell.
          </p>
          <p>
            Questions about any of this: <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </Container>
    </>
  )
}
