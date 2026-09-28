import type { Metadata } from 'next'
import { Container, PageHero } from '@/components/site/page-shell'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Privacy',
  description: 'Veggyz has no accounts, no tracking pixels and no advertising. Here is the little we do collect.',
  path: '/privacy/',
})

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="What we know about you" lede="Almost nothing, and we would like to keep it that way." crumbs={[{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy/' }]} />
      <Container className="py-12 md:py-16">
        <div className="prose-veggyz max-w-3xl">
          <h2>No accounts, no cookies of ours</h2>
          <p>
            Veggyz is a static website. You do not sign up, log in or fill in forms. We set no cookies and run no advertising or social-media pixels.
          </p>
          <h2>Analytics</h2>
          <p>
            We use Cloudflare Web Analytics to count visits. It is cookie-less, does not fingerprint devices and does not track you across other websites. It tells us which pages are popular and roughly which country visitors come from, and nothing about you individually.
          </p>
          <h2>Hosting</h2>
          <p>
            The site is served by Cloudflare, which, like any host, processes your IP address to deliver pages and protect the site from abuse. Cloudflare&rsquo;s own privacy policy covers that processing.
          </p>
          <h2>Outbound links</h2>
          <p>
            Map links open Google Maps, and delivery guides link to the services reviewed. Once you leave veggyz.com, their privacy policies apply, not ours. Some guide links are affiliate links; the referring service may set its own cookie to attribute a signup to us. That is the only way an affiliate relationship touches your data.
          </p>
          <h2>Email</h2>
          <p>
            If you email <a href={`mailto:${site.email}`}>{site.email}</a> to correct a listing, we keep the message for as long as it takes to fix the listing and then delete it. We do not add you to any list.
          </p>
          <p className="text-sm text-muted-foreground">Last updated {site.dataSource.snapshot}.</p>
        </div>
      </Container>
    </>
  )
}
