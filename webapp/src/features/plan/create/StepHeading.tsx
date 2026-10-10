type StepHeadingProps = {
  id: string
  title: string
  subtitle: string
}

export function StepHeading({ id, title, subtitle }: StepHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 id={id} className="text-[32px] leading-[38px] font-bold tracking-tight md:text-[44px] md:leading-[52px]">
        {title}
      </h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  )
}
