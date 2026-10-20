export const site = {
  name: 'Veggyz',
  tagline: 'Eat your veggyz.',
  url: 'https://veggyz.com',
  description:
    'Find farmers markets and CSA farms near you across the US, plus honest comparisons of vegan and plant-based delivery services.',
  email: 'hello@veggyz.com',
  locale: 'en_US',
  /** Source attribution shown on directory pages */
  dataSource: {
    name: 'USDA Local Food Directories',
    url: 'https://www.usdalocalfoodportal.com/',
    snapshot: '2026-09-28',
  },
  /** Cloudflare Web Analytics beacon token — set NEXT_PUBLIC_CF_BEACON_TOKEN to enable */
  cfBeaconToken: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ?? '',
} as const

export const nav = [
  { href: '/farmers-markets/', label: 'Farmers markets' },
  { href: '/csa/', label: 'CSA farms' },
  { href: '/recipes/', label: 'Recipes' },
  { href: '/best/', label: 'Delivery guides' },
  { href: '/about/', label: 'About' },
] as const
