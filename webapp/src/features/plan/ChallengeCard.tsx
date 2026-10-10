import { useState } from 'react'
import { Dices, Shuffle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Language } from '@/i18n'
import { useChallenges } from './planQueries'

export function ChallengeCard() {
  const { t, i18n } = useTranslation()
  const { data: challenges, isPending, isError } = useChallenges()
  const [index, setIndex] = useState(0)

  if (isPending) return <Skeleton className="min-h-72 rounded-3xl" />
  if (isError || challenges.length === 0) return null

  const challenge = challenges[index % challenges.length]
  const language = (i18n.resolvedLanguage ?? 'en') as Language

  const shuffle = () =>
    setIndex((current) => (current + 1 + Math.floor(Math.random() * Math.max(challenges.length - 1, 1))) % challenges.length)

  return (
    <section
      aria-labelledby="challenge-title"
      className="relative isolate flex min-h-72 flex-col gap-6 overflow-hidden rounded-3xl bg-card p-6 ring-1 ring-border paper-shadow md:p-8"
    >
      <span aria-hidden className="absolute -right-6 -bottom-10 -z-10 rotate-12 text-[160px] leading-none opacity-[0.07] select-none">
        🎲
      </span>

      <h2 id="challenge-title" className="flex items-center gap-2 kicker">
        <Dices aria-hidden className="size-4 text-vibe-surprise" />
        {t('home.challengeTitle')}
      </h2>

      <p
        key={challenge.id}
        aria-live="polite"
        className="font-heading text-2xl leading-tight font-bold motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:zoom-in-95 md:text-3xl"
      >
        <span aria-hidden className="mr-2">
          {challenge.emoji}
        </span>
        {challenge.text[language] ?? challenge.text.en}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        <Button variant="secondary" className="font-semibold" onClick={shuffle}>
          <Shuffle />
          {t('home.challengeShuffle')}
        </Button>
        <Button variant="ghost" className="font-semibold">
          {t('home.challengeUse')}
        </Button>
      </div>
    </section>
  )
}
