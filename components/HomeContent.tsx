"use client";

import Link from "next/link";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import { useLocale } from "@/components/LocaleProvider";
import { AURA_TYPES } from "@/lib/constants/auras";
import { getLocalizedWordLabel } from "@/lib/i18n/localize";

const LANDING_EXAMPLE_WORDS_JA = [
  "カリスマ",
  "癒やし枠",
  "透明感",
  "陽キャバイブス",
  "ミステリアス",
  "天才的バカ",
  "ギャップの鬼",
  "天然毒舌",
  "頼れる相棒",
  "深夜テンション",
] as const;

const LANDING_SELECTED = new Set([0, 2, 5]);

export default function HomeContent() {
  const { locale, t } = useLocale();

  const exampleWords = LANDING_EXAMPLE_WORDS_JA.map((label, index) => ({
    label: getLocalizedWordLabel(label, locale),
    selected: LANDING_SELECTED.has(index),
  }));

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <AuraBackground />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl space-y-12 sm:space-y-16">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-violet-300/50 bg-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/30"
          >
            {t.landing.myAura}
          </Link>
          <Link
            href="/auras"
            className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            {t.landing.viewEncyclopedia}
          </Link>
        </div>

        <section className="rounded-3xl border border-white/20 bg-black/35 p-5 backdrop-blur sm:p-8 md:p-10">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">AuraMaker</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            {t.landing.hero}
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">{t.landing.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <AnonymousStartButton className="w-full rounded-full bg-violet-300 px-6 py-3 text-center font-semibold text-black disabled:opacity-60 sm:w-auto" />
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-center font-semibold text-white sm:w-auto"
            >
              {t.landing.login}
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-white/75">{t.landing.keywordHint}</p>
            <div className="mt-3 flex flex-wrap gap-2" aria-hidden>
              {exampleWords.map((word) => (
                <span
                  key={word.label}
                  className={
                    word.selected
                      ? "rounded-full bg-violet-300 px-3 py-2 text-sm font-semibold text-black"
                      : "rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white/85"
                  }
                >
                  {word.label}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-white/55">{t.landing.flow}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-black/30 p-6 text-center backdrop-blur sm:p-8">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">Aura Encyclopedia</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            {t.landing.encyclopediaTitle.replace("{count}", String(AURA_TYPES.length))}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
            {t.landing.encyclopediaSub}
          </p>
          <Link
            href="/auras"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] sm:text-base"
          >
            {t.landing.openEncyclopedia}
          </Link>
        </section>
      </div>
    </main>
  );
}
