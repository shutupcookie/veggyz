import Link from '@/components/site/link'
import { Container } from '@/components/site/page-shell'
import { SearchBox } from '@/components/site/search-box'

export default function NotFound() {
  return (
    <Container className="py-20 md:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-beet md:text-6xl">Nothing growing here.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
        That page does not exist, or the market moved. Try a town name, or start from the directories.
      </p>
      <div className="mt-8 max-w-md">
        <SearchBox />
      </div>
      <p className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/farmers-markets/" className="text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">Farmers markets</Link>
        <Link href="/csa/" className="text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">CSA farms</Link>
        <Link href="/best/" className="text-beet underline decoration-beet/30 underline-offset-4 hover:decoration-beet">Delivery guides</Link>
      </p>
    </Container>
  )
}
