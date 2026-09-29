# veggyz.com

Real vegetables, near you. A static directory of US farmers markets and CSA
farms (USDA Local Food Directories data) plus honest guides to plant-based
delivery services. Next.js 16 static export, served from Cloudflare.

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # static export → ./out  (also strips RSC payloads and checks the file count)
pnpm preview        # serve ./out locally
```

Requires Node 22+ and pnpm (`corepack enable`).

## Layout

```
app/                      routes (App Router, all static)
  farmers-markets/        index → [state] → [state]/[city]
  csa/                    index → [state] → [state]/[city] → [state]/[city]/[slug]
  best/                   delivery guides (content/guides.ts)
  brand/                  internal brand guidelines (noindex)
  fonts/                  self-hosted Bricolage Grotesque + DM Sans (OFL)
components/site/          header, footer, cards, search box, page shell
components/brand/         the brand-guideline page's own components
content/guides.ts         guide copy, picks, prices — edit here
content/affiliates.ts     outbound links; flip `affiliate: true` when approved
data/raw/                 USDA exports + cities gazetteer (not committed; see below)
data/generated/           normalised JSON the pages read (committed)
scripts/build-data.mjs    raw → generated
scripts/build-og.mjs      renders public/og-default.png
scripts/check-export.mjs  post-build guard for Cloudflare's asset limits
lib/                      data access, SEO/JSON-LD helpers, site config
```

## Refreshing the directory data

The USDA portal blocks scripted downloads, so grab the exports in a browser:

1. Open <https://www.usdalocalfoodportal.com/fe/datasharing/>, choose
   *Farmers Market*, download; repeat for *CSA*. (Or use the JSON endpoint the
   page calls: `/api/download_by_directory/?directory=farmersmarket` and
   `?directory=csa`.) Save them as `data/raw/usda-farmersmarket-YYYY-MM-DD.json`
   and `data/raw/usda-csa-YYYY-MM-DD.json` (the JSON, not the xlsx). Copies
   live in iCloud → VEGGYZ/Data.
2. `data/raw/us_cities.csv` is the kelvins/US-Cities-Database gazetteer (MIT).
3. `pnpm data` — prints counts, writes `data/generated/*.json` and
   `public/search-index.json`.
4. Update `dataSource.snapshot` in `lib/site.ts`, then `pnpm build`.

The pipeline parses city/state/zip out of free-text addresses, snaps listings
to gazetteer cities (canonical spelling, county, coordinates), dedupes, builds
nearby-town links (≤ 40 mi) and title-cases shouting names. Listings it can't
place in a state or town are dropped and counted in `data/generated/summary.json`.

## Deploying to Cloudflare

Workers static assets (free plan: 20,000 files; we ship ~8,200).

```bash
npx wrangler login        # once
pnpm run ship             # build + upload (or `npx wrangler deploy` to upload an existing build)
```

Then in the Cloudflare dashboard: Workers & Pages → veggyz → Settings →
Domains & Routes → add `veggyz.com` and `www.veggyz.com`. Optional:
Analytics & Logs → Web Analytics → add site → put the token in
`NEXT_PUBLIC_CF_BEACON_TOKEN` (see `.env.example`) and rebuild.

Or connect the GitHub repo in Workers & Pages → Create → import repository,
build command `pnpm build`, deploy command `npx wrangler deploy`.

## Why plain `<a>` instead of `next/link`

Every visit here is a page from a search engine. `components/site/link.tsx`
renders plain anchors, so navigations are full loads and the RSC payload files
(`*.txt`, five per route in Next 16) can be deleted after the build. That keeps
the export at ~8k files instead of ~49k.

## Growing it

* **Farmers market detail pages** — `app/farmers-markets/[state]/[city]/[slug]`
  would add ~7,100 routes; needs Workers Paid ($5/mo, 100k files) or trimming.
* **Hours / websites** — not in the bulk export. The USDA API
  (`/api/farmersmarket/?apikey=…&state=XX`, free key at
  usdalocalfoodportal.com/fe/fregisterpublicapi/) returns `media_website` and
  more; merge by `listing_id` in `build-data.mjs`.
* **Restaurants** — OpenStreetMap `diet:vegan=*` via Overpass for a third directory.
* **Affiliates** — apply (Impact for Purple Carrot / Hungryroot / Green Chef /
  Misfits), then edit `content/affiliates.ts`.
