import type { AnchorHTMLAttributes } from 'react'

/**
 * Plain anchor used instead of next/link.
 *
 * The site is a static export served from Cloudflare's edge, and almost every
 * visit is a single page from a search engine. Full-page navigations are fast
 * and let us drop the RSC payload (.txt) files that next/link needs, which
 * keeps the static-asset count well under Cloudflare's limits.
 */
export default function Link({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} {...rest} />
}
