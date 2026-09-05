"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import { AuraSphereCompact } from "@/components/AuraSphere";
import { useLocale } from "@/components/LocaleProvider";
import { AURA_TYPES, getAuraById, getAuraLineage } from "@/lib/constants/auras";
import { getLocalizedWordLabel, getRarityLabel, localizeAuraType } from "@/lib/i18n/localize";
import type { PublicStats } from "@/lib/stats/public";
import PopularAurasStrip from "@/components/PopularAurasStrip";

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
const LANDING_EXAMPLE_AURA_ID = "sunrise-hero";

type HomeContentProps = {
  stats?: PublicStats;
};

export default function HomeContent({ stats }: HomeContentProps) {
  const { locale, t } = useLocale();

  const exampleWords = LANDING_EXAMPLE_WORDS_JA.map((label, index) => ({
    label: getLocalizedWordLabel(label, locale),
    selected: LANDING_SELECTED.has(index),
  }));

  const rawExampleAura = getAuraById(LANDING_EXAMPLE_AURA_ID);
  const exampleAura = rawExampleAura ? localizeAuraType(rawExampleAura, locale) : null;
  const exampleLineage = exampleAura ? getAuraLineage(exampleAura.id) : undefined;
  const auraCount = stats?.auraTypeCount ?? AURA_TYPES.length;
  const voteCount = stats?.friendVoteCount ?? 0;

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <AuraBackground />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl space-y-12 sm:space-y-16">
        <section className="rounded-3xl border border-white/20 bg-black/35 p-5 backdrop-blur sm:p-8 md:p-10">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">AuraMaker</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            {t.landing.hero}
          </h1>
          <p className="mt-4 text-lg font-black leading-snug text-cyan-100 sm:text-xl">
            {t.landing.reasonHook}
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-violet-300/40 bg-violet-500/15 px-4 py-3.5 text-base font-semibold leading-relaxed text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.18)] sm:px-5 sm:py-4 sm:text-lg">
            {t.landing.sub}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold sm:text-sm">
            {voteCount > 0 ? (
              <span className="rounded-full border border-cyan-200/40 bg-cyan-400/15 px-3 py-1.5 text-cyan-50">
                {t.landing.proofVotes.replace(
                  "{count}",
                  voteCount.toLocaleString(locale === "en" ? "en" : "ja"),
                )}
              </span>
            ) : null}
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-white/85">
              {t.landing.proofAuras.replace("{count}", String(auraCount))}
            </span>
            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-white/60">
              {t.landing.proofNote}
            </span>
          </div>

          <p className="mt-5 text-sm font-semibold leading-relaxed text-white/80 sm:text-base">
            {t.landing.flow}
          </p>

          {exampleAura ? (
            <div
              className="mt-8 rounded-2xl border border-white/15 bg-black/40 px-4 py-5 text-center sm:px-6 sm:py-6"
              style={
                {
                  "--card-a": exampleAura.palette.a,
                  "--card-b": exampleAura.palette.b,
                  "--card-c": exampleAura.palette.c,
                  borderColor: `${exampleAura.palette.a}55`,
                } as CSSProperties
              }
            >
              <div className="space-y-1">
                <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-white/80">
                  {t.landing.exampleLabel}
                </span>
                <p className="text-xs font-semibold text-white/60 sm:text-sm">
                  {t.landing.exampleCaption}
                </p>
              </div>

              <div className="relative mx-auto mt-4 h-28 w-28 sm:h-32 sm:w-32">
                <AuraSphereCompact
                  auraId={exampleAura.id}
                  palette={exampleAura.palette}
                  lineage={exampleLineage}
                  className="size-full"
                />
              </div>

              <span
                className="mt-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black tracking-wide text-white"
                style={{
                  borderColor: `${exampleAura.palette.a}aa`,
                  background: `color-mix(in srgb, ${exampleAura.palette.a} 22%, transparent)`,
                }}
              >
                {getRarityLabel(exampleAura.rarity, locale)}
              </span>

              <h2
                className="mt-3 text-2xl font-black leading-tight sm:text-3xl"
                style={{
                  backgroundImage: `linear-gradient(120deg, #fff 0%, ${exampleAura.palette.a} 42%, ${exampleAura.palette.b} 78%, ${exampleAura.palette.c} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {exampleAura.archetypeName}
              </h2>
              <p className="mt-1 text-xs font-medium" style={{ color: `${exampleAura.palette.a}cc` }}>
                {exampleAura.name}
              </p>
              <p className="mt-2 text-sm font-medium text-white/75">{exampleAura.catchCopy}</p>
            </div>
          ) : null}

          <div className="mt-8">
            <AnonymousStartButton className="w-full rounded-full bg-violet-300 px-6 py-3.5 text-center text-base font-bold text-black disabled:opacity-60 sm:w-auto sm:min-w-56 sm:py-4 sm:text-lg" />
          </div>

          {stats?.popularAuras?.length ? (
            <div className="mt-8">
              <PopularAurasStrip popularAuras={stats.popularAuras} source="landing" />
            </div>
          ) : null}

          <div className="mt-8">
            <p className="text-sm font-semibold text-white/75">{t.landing.keywordHint}</p>
            <div className="mt-3 flex flex-wrap gap-2" aria-hidden>
              {exampleWords.map((word, index) => (
                <span
                  key={`${index}-${word.label}`}
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
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-black/30 p-6 text-center backdrop-blur sm:p-8">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">Aura Encyclopedia</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            {t.landing.encyclopediaTitle.replace("{count}", String(auraCount))}
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
