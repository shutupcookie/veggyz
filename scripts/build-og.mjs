// Renders public/og-default.png (1200×630) from an inline HTML card using
// Playwright's Chromium. Optional: the PNG is committed, so you only need
// this when the wordmark or tagline changes.  `pnpm og`
import fs from 'node:fs'
import path from 'node:path'

const svg = fs.readFileSync(path.resolve('public/brand/logos/veggyz-logo-horizontal-reverse-on-beet.svg'), 'utf8')
const font = (f) => `url(data:font/woff2;base64,${fs.readFileSync(path.resolve('app/fonts', f)).toString('base64')}) format('woff2')`
const lockup = svg.replace(/<rect[^>]*\/>/, '') // drop the background rect; we paint Beet ourselves

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face{font-family:'Bricolage Grotesque';font-weight:200 800;src:${font('bricolage-grotesque-latin-wght.woff2')}}
  @font-face{font-family:'DM Sans';font-weight:100 1000;src:${font('dm-sans-latin-wght.woff2')}}
  html,body{margin:0}
  body{width:1200px;height:630px;background:#5A1236;color:#F6F4EC;font-family:'DM Sans',system-ui,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;box-sizing:border-box}
  .logo svg{height:110px;width:auto}
  h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:88px;line-height:.95;letter-spacing:-.02em;margin:0;max-width:980px}
  h1 span{color:#B1FF2D}
  p{margin:0;font-size:28px;color:rgba(246,244,236,.8)}
  .row{display:flex;justify-content:space-between;align-items:flex-end}
  .pill{font-weight:500;font-size:22px;border:2px solid rgba(246,244,236,.35);border-radius:999px;padding:10px 22px}
</style></head><body>
  <div class="logo">${lockup}</div>
  <div>
    <h1>Real vegetables, <span>near you.</span></h1>
  </div>
  <div class="row">
    <p>Farmers markets · CSA farms · plant-based delivery, compared</p>
    <span class="pill">veggyz.com</span>
  </div>
</body></html>`

let chromium
try {
  ;({ chromium } = globalThis.__pw ?? (await import('playwright')))
} catch {
  console.error('build-og: playwright is not installed; run `pnpm add -D playwright` (or keep the committed PNG).')
  process.exit(0)
}
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.resolve('public/og-default.png'), type: 'png' })
await browser.close()
console.log('build-og: wrote public/og-default.png')
