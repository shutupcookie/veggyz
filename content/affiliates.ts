/**
 * Outbound links for delivery guides.
 *
 * Every entry starts as a plain link to the service's own site. When an
 * affiliate program approves us, replace `url` with the tracking link and set
 * `affiliate: true` — the guide pages then add rel="sponsored" automatically
 * and the disclosure line stays accurate. Nothing else needs to change.
 */
export interface Outbound {
  url: string
  affiliate: boolean
  /** Where to apply, for future-you */
  program?: string
}

export const outbound: Record<string, Outbound> = {
  'purple-carrot': { url: 'https://www.purplecarrot.com/', affiliate: false, program: 'Impact' },
  sprinly: { url: 'https://www.sprinly.com/', affiliate: false, program: 'direct' },
  'green-chef': { url: 'https://www.greenchef.com/', affiliate: false, program: 'Impact (HelloFresh Group)' },
  'mosaic-foods': { url: 'https://www.mosaicfoods.com/', affiliate: false, program: 'ShareASale / direct' },
  hungryroot: { url: 'https://www.hungryroot.com/', affiliate: false, program: 'Impact' },
  'splendid-spoon': { url: 'https://splendidspoon.com/', affiliate: false, program: 'Impact' },
  sakara: { url: 'https://www.sakara.com/', affiliate: false, program: 'Impact' },
  factor: { url: 'https://www.factor75.com/', affiliate: false, program: 'Impact (HelloFresh Group)' },
  hellofresh: { url: 'https://www.hellofresh.com/', affiliate: false, program: 'Impact' },
  sunbasket: { url: 'https://sunbasket.com/', affiliate: false, program: 'Impact' },
  'blue-apron': { url: 'https://www.blueapron.com/', affiliate: false, program: 'Impact' },
  'misfits-market': { url: 'https://www.misfitsmarket.com/', affiliate: false, program: 'Impact' },
  'hungry-harvest': { url: 'https://hungryharvest.net/', affiliate: false, program: 'direct' },
  'farm-fresh-to-you': { url: 'https://www.farmfreshtoyou.com/', affiliate: false, program: 'direct' },
  'farmbox-direct': { url: 'https://www.farmboxdirect.com/', affiliate: false, program: 'ShareASale' },
  'farm-to-people': { url: 'https://farmtopeople.com/', affiliate: false, program: 'direct' },
  'forks-meal-planner': { url: 'https://www.forksmealplanner.com/', affiliate: false, program: 'direct' },
  mealime: { url: 'https://www.mealime.com/', affiliate: false, program: 'none' },
  'eat-this-much': { url: 'https://www.eatthismuch.com/', affiliate: false, program: 'direct' },
  platejoy: { url: 'https://www.platejoy.com/', affiliate: false, program: 'Impact' },
  paprika: { url: 'https://www.paprikaapp.com/', affiliate: false, program: 'none' },
}

export function linkFor(key: string): Outbound {
  const o = outbound[key]
  if (!o) throw new Error(`No outbound link configured for "${key}"`)
  return o
}
