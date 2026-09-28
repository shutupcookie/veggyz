// Post-build guard: Cloudflare Workers (free plan) serves at most 20,000 static
// assets per version. Fail loudly before a deploy would.
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('out')
const LIMIT = 20000

// The site uses plain anchors (components/site/link.tsx), so the RSC payload
// files next/link would fetch are dead weight: remove them before counting.
function stripRsc(dir, n = 0) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) n = stripRsc(p, n)
    else if (e.name.endsWith('.txt') && !(dir === OUT && e.name === 'robots.txt')) { fs.unlinkSync(p); n++ }
  }
  return n
}

function walk(dir, acc = { files: 0, bytes: 0, html: 0 }) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else {
      acc.files++
      acc.bytes += fs.statSync(p).size
      if (e.name.endsWith('.html')) acc.html++
    }
  }
  return acc
}

if (!fs.existsSync(OUT)) {
  console.log('check-export: no ./out directory (not a static export build?) — skipping')
  process.exit(0)
}
const removed = stripRsc(OUT)
console.log(`check-export: removed ${removed.toLocaleString()} RSC payload files`)
const s = walk(OUT)
console.log(`check-export: ${s.files.toLocaleString()} files (${s.html.toLocaleString()} html), ${(s.bytes / 1e6).toFixed(1)} MB`)
if (s.files > LIMIT) {
  console.error(`check-export: ${s.files} files exceeds the ${LIMIT} static-asset limit on the Workers free plan. Reduce generated routes or move to Workers Paid (100,000 files).`)
  process.exit(1)
}
