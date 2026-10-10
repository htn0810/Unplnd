import { BongSprite } from '@/components/BongSprite'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto flex min-h-[70svh] max-w-md flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <div className="relative flex items-end">
        <span aria-hidden className="font-heading text-[110px] leading-none font-bold text-brand-gradient">
          4
        </span>
        <BongSprite className="-mb-2 size-28" />
        <span aria-hidden className="font-heading text-[110px] leading-none font-bold text-brand-gradient">
          4
        </span>
      </div>
      <h1 className="text-2xl font-bold">{t('notFound.title')}</h1>
      <p className="text-muted-foreground">{t('notFound.body')}</p>
      <Link to={ROUTES.home} className={cn(buttonVariants({ size: 'lg' }), 'mt-2 font-bold')}>
        {t('notFound.cta')}
      </Link>
    </main>
  )
}
