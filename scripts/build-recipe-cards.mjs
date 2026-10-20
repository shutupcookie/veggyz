// Renders a branded image card per recipe into public/recipes/cards/:
//   <slug>.png      1200×630  (Open Graph / social)
//   <slug>-sq.png   1200×1200 (schema.org Recipe image, 1:1)
// Typographic placeholders until real food photography exists. The PNGs are
// committed, so this only needs re-running when recipes are added or renamed.
//   pnpm cards
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const root = process.cwd()
const outDir = path.join(root, 'public/recipes/cards')
fs.mkdirSync(outDir, { recursive: true })

// ---- load the TypeScript recipe content without a TS runtime -------------
const srcDir = path.join(root, 'content/recipes')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'veggyz-recipes-'))
for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith('.ts'))) {
  const src = fs.readFileSync(path.join(srcDir, f), 'utf8')
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  fs.writeFileSync(path.join(tmp, f.replace(/\.ts$/, '.mjs')), js.replace(/from '\.\/([\w-]+)'/g, "from './$1.mjs'"))
}
const { recipes, collections, equipmentLabel } = await import(pathToFileURL(path.join(tmp, 'index.mjs')).href)

// ---- fonts: static WOFF instances (satori can't read the site's variable woff2) ---
const woff = (pkg, f) => fs.readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', f))
const bricolage = woff('bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff')
const dmSans = woff('dm-sans', 'dm-sans-latin-500-normal.woff')
const fonts = [
  { name: 'Bricolage', data: bricolage, weight: 800, style: 'normal' },
  { name: 'DM Sans', data: dmSans, weight: 500, style: 'normal' },
]

const C = { beet: '#5A1236', husk: '#F6F4EC', lime: '#B1FF2D', carrot: '#FF6B2C' }
const h = (type, style, ...children) => ({ type, props: { style, children: children.flat() } })

// The two-leaf sprout mark, drawn with two rotated ellipses (satori has no SVG paths in divs)
const sprout = (size) =>
  h('div', { display: 'flex', position: 'relative', width: size, height: size },
    h('div', { position: 'absolute', left: size * 0.12, top: size * 0.08, width: size * 0.38, height: size * 0.78, borderRadius: '50%', background: C.lime, transform: 'rotate(-28deg)' }),
    h('div', { position: 'absolute', left: size * 0.5, top: size * 0.08, width: size * 0.38, height: size * 0.78, borderRadius: '50%', background: C.carrot, transform: 'rotate(28deg)' }),
  )

function card(r, w, hgt) {
  const square = w === hgt
  const total = r.prepMinutes + r.cookMinutes
  const coll = collections.find((c) => c.slug === r.collection)
  const titleSize = square ? (r.title.length > 48 ? 84 : 100) : r.title.length > 52 ? 62 : r.title.length > 36 ? 72 : 84
  const pills = [r.equipment.map((e) => equipmentLabel[e]).join(' + '), r.diets.includes('vegan') ? 'Vegan' : 'Vegetarian', `Serves ${r.servings}`]
  const pad = square ? 88 : 64
  return h('div', { display: 'flex', position: 'relative', width: w, height: hgt, background: C.beet, color: C.husk, fontFamily: 'DM Sans' },
   h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute', left: pad, top: pad, width: w - pad * 2, height: hgt - pad * 2 },
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      h('div', { display: 'flex', alignItems: 'center', gap: 16 },
        sprout(square ? 64 : 52),
        h('div', { display: 'flex', fontFamily: 'Bricolage', fontSize: square ? 48 : 40, letterSpacing: -1 }, 'veggy', h('span', { color: C.carrot }, 'z')),
      ),
      h('div', { display: 'flex', fontSize: square ? 26 : 22, color: C.lime, textTransform: 'uppercase', letterSpacing: 4 }, coll.title),
    ),
    h('div', { display: 'flex', flexDirection: 'column', gap: square ? 36 : 22 },
      h('div', { display: 'flex', alignItems: 'baseline', gap: 14 },
        h('div', { display: 'flex', fontFamily: 'Bricolage', fontSize: square ? 200 : 120, color: C.lime, lineHeight: 0.9, letterSpacing: -6 }, String(total)),
        h('div', { display: 'flex', fontFamily: 'Bricolage', fontSize: square ? 60 : 40, color: C.lime }, 'min'),
      ),
      h('div', { display: 'flex', fontFamily: 'Bricolage', fontSize: titleSize, lineHeight: 0.98, letterSpacing: -2, maxWidth: w - pad * 2 }, r.title),
    ),
    h('div', { display: 'flex', gap: 14, flexWrap: 'wrap' },
      ...pills.map((p) => h('div', { display: 'flex', fontSize: square ? 28 : 22, border: '2px solid rgba(246,244,236,0.35)', borderRadius: 999, padding: square ? '12px 26px' : '8px 20px' }, p)),
    ),
   ),
  )
}

let n = 0
for (const r of recipes) {
  for (const [suffix, w, hgt] of [['', 1200, 630], ['-sq', 1200, 1200]]) {
    const svg = await satori(card(r, w, hgt), { width: w, height: hgt, fonts })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng()
    fs.writeFileSync(path.join(outDir, `${r.slug}${suffix}.png`), png)
    n++
  }
}
// remove cards for recipes that no longer exist
const keep = new Set(recipes.flatMap((r) => [`${r.slug}.png`, `${r.slug}-sq.png`]))
for (const f of fs.readdirSync(outDir)) if (!keep.has(f)) fs.unlinkSync(path.join(outDir, f))
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`build-recipe-cards: wrote ${n} images for ${recipes.length} recipes`)
