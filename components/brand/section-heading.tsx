export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-extrabold leading-none tracking-tight text-beet text-balance md:text-6xl">
        {title}
      </h2>
      {children ? (
        <p className="text-lg leading-relaxed text-muted-foreground text-pretty">{children}</p>
      ) : null}
    </div>
  )
}
