import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  title: string
  subtitle?: string
  action?: ReactNode
}

/** Display-size heading for Home discovery sections */
export function SectionHeading({ id, title, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="w-fit text-2xl leading-tight font-bold tracking-tight brush-underline md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
