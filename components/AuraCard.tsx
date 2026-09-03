"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AuraEvolutionPrompt } from "@/components/AuraEvolutionOverlay";
import AuraSphere, { AuraSphereCompact } from "@/components/AuraSphere";
import { useLocale } from "@/components/LocaleProvider";
import MorphingText from "@/components/MorphingText";
import type { AuraType, DynamicAuraProfile } from "@/lib/constants/auras";
import { getAuraById, getAuraCatalogEcology, getAuraLineage, SECRET_FLAVOR } from "@/lib/constants/auras";
import { getRarityLabel, localizeAuraType } from "@/lib/i18n/localize";
import { AURA_EN } from "@/lib/i18n/en/auras";
import type { Messages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

type AuraCardProps = {
  aura: AuraType;
  catchCopy: string;
  profile: DynamicAuraProfile;
  topWords: string[];
  hasVotes: boolean;
  pulse?: boolean;
  displayName?: string;
  /** 10票以上で解放される覚醒ビジュアル */
  awakened?: boolean;
  /** 進化待ち：オーブ上に Tap、名前欄に Change Your Aura */
  evolutionPending?: boolean;
  /** じわっと変化中（色クロスフェード＋文字フェード） */
  evolutionMorphing?: boolean;
  /** モーフィング元のオーラ（オーブ色・文言のクロスフェード用） */
  morphFromAura?: AuraType | null;
  /** モーフィング元のキャッチコピー */
  morphFromCatchCopy?: string | null;
};

function statMeta(t: Messages["aura"]) {
  return [
    { key: "social" as const, label: t.statSocial, short: t.statSocialShort, color: "#fbbf24" },
    { key: "neta" as const, label: t.statNeta, short: t.statNetaShort, color: "#e879f9" },
    { key: "mystic" as const, label: t.statMystic, short: t.statMysticShort, color: "#818cf8" },
    { key: "heal" as const, label: t.statHeal, short: t.statHealShort, color: "#6ee7b7" },
    { key: "gap" as const, label: t.statGap, short: t.statGapShort, color: "#22d3ee" },
  ];
}

function quoteWrap(text: string, locale: Locale) {
  return locale === "en" ? `"${text}"` : `「${text}」`;
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/75">
        <span>{label}</span>
        <span className="font-semibold tabular-nums text-white/90">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

type CompatPreview = {
  kind: "good" | "bad";
  aura: AuraType;
};

function CompatAuraTile({
  kind,
  auraId,
  onOpen,
  locale,
  t,
}: {
  kind: "good" | "bad";
  auraId: string;
  onOpen: () => void;
  locale: Locale;
  t: Messages;
}) {
  const raw = getAuraById(auraId);
  if (!raw) return null;
  const aura = localizeAuraType(raw, locale);
  const isSecret = aura.rarity === "secret";
  const lineage = getAuraLineage(aura.id);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] sm:p-4 ${
        kind === "good"
          ? "border-emerald-400/30 bg-emerald-500/10 hover:border-emerald-300/50 hover:bg-emerald-500/15"
          : "border-rose-400/30 bg-rose-500/10 hover:border-rose-300/50 hover:bg-rose-500/15"
      }`}
    >
      <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
        <AuraSphereCompact
          auraId={aura.id}
          palette={aura.palette}
          lineage={lineage}
          secret={isSecret}
          className="size-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-semibold ${kind === "good" ? "text-emerald-200" : "text-rose-200"}`}
        >
          {kind === "good" ? `🔗 ${t.aura.goodAura}` : `⚔️ ${t.aura.badAura}`}
        </p>
        <p
          className={`mt-1 break-words text-base font-black leading-snug ${kind === "good" ? "text-emerald-50" : "text-rose-50"}`}
        >
          {isSecret ? t.aura.secretName : aura.archetypeName}
        </p>
        {!isSecret ? (
          <p className="mt-0.5 break-words text-[11px] text-white/50">{aura.name}</p>
        ) : null}
        <p className={`mt-1.5 text-[11px] ${kind === "good" ? "text-emerald-100/60" : "text-rose-100/60"}`}>
          {isSecret ? t.aura.tapSecret : t.aura.tapView}
        </p>
      </div>
    </button>
  );
}

function CompatibilityAuraModal({
  preview,
  onClose,
  locale,
  t,
}: {
  preview: CompatPreview;
  onClose: () => void;
  locale: Locale;
  t: Messages;
}) {
  const { aura, kind } = preview;
  const isSecret = aura.rarity === "secret";
  const lineage = getAuraLineage(aura.id);
  const secretFlavor = locale === "en" ? t.aura.secretFlavor : SECRET_FLAVOR;
  const catalogEcology =
    locale === "en" && AURA_EN[aura.id]
      ? {
          habitat: AURA_EN[aura.id].ecology.habitat,
          weakness: AURA_EN[aura.id].ecology.weakness,
        }
      : getAuraCatalogEcology(aura.id);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 px-4 py-6 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${aura.archetypeName}の特徴`}
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border bg-zinc-950 p-5 text-white shadow-2xl sm:p-6"
        style={{
          borderColor: `${aura.palette.a}66`,
          boxShadow: `0 0 40px ${aura.palette.a}33`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-xs font-semibold tracking-[0.18em] ${
              kind === "good" ? "text-emerald-200" : "text-rose-200"
            }`}
          >
            {kind === "good" ? `🔗 ${t.aura.goodAura}` : `⚔️ ${t.aura.badAura}`}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70"
          >
            {t.aura.close}
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center text-center">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            <AuraSphereCompact
              auraId={aura.id}
              palette={aura.palette}
              lineage={lineage}
              secret={isSecret}
              className="size-full"
            />
          </div>

          <span className="mt-4 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">
            {getRarityLabel(aura.rarity, locale)}
          </span>
          {lineage ? (
            <p className="mt-2 text-[11px] font-semibold tracking-[0.18em]" style={{ color: lineage.accent }}>
              {lineage.name}
            </p>
          ) : null}
          <h3 className="mt-2 break-words text-2xl font-black leading-tight">
            {isSecret ? t.aura.secretName : aura.archetypeName}
          </h3>
          {!isSecret ? (
            <p className="mt-1 break-words text-sm text-white/55">{aura.name}</p>
          ) : null}
          <p className="mt-3 break-words text-sm text-cyan-100/90">
            {isSecret ? t.aura.secretFlavor : aura.catchCopy}
          </p>
          <p className="mt-3 break-words text-sm leading-relaxed text-white/75">
            {isSecret ? secretFlavor : aura.description}
          </p>
          {!isSecret && aura.keywords.length > 0 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {aura.keywords.slice(0, 6).map((word) => (
                <span
                  key={word}
                  className="rounded-full border px-2.5 py-1 text-xs font-semibold text-white/80"
                  style={{
                    borderColor: `${aura.palette.a}55`,
                    background: `color-mix(in srgb, ${aura.palette.a} 15%, transparent)`,
                  }}
                >
                  #{word}
                </span>
              ))}
            </div>
          ) : null}
          {!isSecret && (catalogEcology.habitat || catalogEcology.weakness) ? (
            <div className="mt-5 w-full space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left text-xs">
              {catalogEcology.habitat ? (
                <p>
                  <span className="font-bold text-violet-200">{t.aura.habitat}：</span>
                  <span className="text-white/75">{catalogEcology.habitat}</span>
                </p>
              ) : null}
              {catalogEcology.weakness ? (
                <p>
                  <span className="font-bold text-amber-200">{t.aura.weakness}：</span>
                  <span className="text-white/75">{catalogEcology.weakness}</span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[0.22em] text-white/45 uppercase">{children}</p>
  );
}

export default function AuraCard({
  aura,
  catchCopy,
  profile,
  topWords,
  hasVotes,
  pulse = false,
  displayName,
  awakened = false,
  evolutionPending = false,
  evolutionMorphing = false,
  morphFromAura = null,
  morphFromCatchCopy = null,
}: AuraCardProps) {
  const { locale, t } = useLocale();
  const stats = statMeta(t.aura);
  const [compatPreview, setCompatPreview] = useState<CompatPreview | null>(null);

  function openCompat(kind: "good" | "bad") {
    const targetId = kind === "good" ? profile.compatibility.good.id : profile.compatibility.bad.id;
    const target = getAuraById(targetId);
    if (!target) return;
    setCompatPreview({ kind, aura: localizeAuraType(target, locale) });
  }

  const heroTags =
    profile.evidence.length > 0
      ? profile.evidence.slice(0, 3).map((item) => item.word)
      : topWords.slice(0, 3);

  const oneLineCatch = aura.catchCopy || catchCopy;
  const lineage = getAuraLineage(aura.id);

  const topStatBadges = [...stats]
    .map((stat) => ({ ...stat, value: profile.stats[stat.key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const ecologyRows = [
    { label: t.aura.habitat, value: profile.ecology.habitat, tone: "violet" as const },
    { label: t.aura.trigger, value: profile.ecology.trigger, tone: "cyan" as const },
    { label: t.aura.weakness, value: profile.ecology.weakness, tone: "amber" as const },
    { label: t.aura.sideEffect, value: profile.ecology.sideEffect, tone: "fuchsia" as const },
  ];

  return (
    <div className="min-w-0 space-y-0">
      {/* ========== First View: スクショ映え ========== */}
      {/* 進化演出の対象はここまで。取扱説明書（AURA MANUAL）以降は通常差し替えのみ */}
      <section
        className={`min-w-0 rounded-3xl border bg-black/35 p-5 backdrop-blur sm:p-8 ${lineage?.id === "legend" ? "aura-result-legend-frame" : "border-white/20"}`}
        style={
          {
            "--card-a": aura.palette.a,
            "--card-b": aura.palette.b,
            "--card-c": aura.palette.c,
          } as CSSProperties
        }
      >
        <div className="flex flex-col items-center text-center">
          {evolutionPending && !evolutionMorphing ? (
            <p className="aura-evolve-title font-display text-xl text-white/90 sm:text-2xl">
              {t.aura.changeYourAura}
            </p>
          ) : displayName ? (
            <p className="text-sm font-semibold text-white/70 sm:text-base">{displayName}</p>
          ) : null}

          <div className="relative mt-3 w-full sm:mt-4">
            <AuraSphere
              auraId={aura.id}
              palette={aura.palette}
              lineage={lineage}
              hasVotes={hasVotes}
              awakened={awakened}
              secret={aura.rarity === "secret"}
              pulse={pulse}
              evolutionMorphing={evolutionMorphing}
              morphFromPalette={morphFromAura?.palette}
              className="relative mx-auto h-40 w-40 sm:h-56 sm:w-56"
            >
              <AuraEvolutionPrompt active={evolutionPending && !evolutionMorphing} />
            </AuraSphere>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/80 px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md sm:mt-7 sm:px-4">
            <span
              className="rounded-full border px-3 py-1 text-xs font-black tracking-wide text-white"
              style={{
                borderColor: `${aura.palette.a}cc`,
                background: `color-mix(in srgb, ${aura.palette.a} 38%, rgb(9 9 11))`,
                boxShadow: `0 0 12px ${aura.palette.a}44`,
              }}
            >
              {getRarityLabel(aura.rarity, locale)}
            </span>
            {awakened ? (
              <span className="rounded-full border border-amber-300/80 bg-amber-950/90 px-3 py-1 text-xs font-black text-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                {t.aura.awakened}
              </span>
            ) : null}
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                profile.confidence === "provisional"
                  ? "border-amber-300/70 bg-amber-950/90 text-amber-50"
                  : profile.confidence === "growing"
                    ? "border-cyan-300/60 bg-cyan-950/90 text-cyan-50"
                    : "border-emerald-300/60 bg-emerald-950/90 text-emerald-50"
              }`}
            >
              {profile.confidence === "provisional"
                ? t.aura.provisional
                : profile.confidence === "growing"
                  ? t.aura.growing
                  : t.aura.stable}
            </span>
          </div>

          <p className="mt-4 text-[11px] font-bold tracking-[0.28em] text-white/45">{t.aura.alias}</p>
          <h2
            className="mt-1 max-w-full break-words text-[clamp(2.25rem,10vw,4rem)] font-black leading-[1.02] tracking-tight"
            style={{
              backgroundImage: `linear-gradient(120deg, #fff 0%, ${aura.palette.a} 42%, ${aura.palette.b} 78%, ${aura.palette.c} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 32px ${aura.palette.a}77)`,
            }}
          >
            {evolutionMorphing && morphFromAura ? (
              <MorphingText
                from={morphFromAura.archetypeName}
                to={aura.archetypeName}
                active
                className="inline"
              />
            ) : (
              aura.archetypeName
            )}
          </h2>
          <p className="mt-1 break-words text-xs font-medium text-white/50 sm:text-sm">
            {evolutionMorphing && morphFromAura ? (
              <MorphingText from={morphFromAura.name} to={aura.name} active className="inline" />
            ) : (
              aura.name
            )}
          </p>

          <p className="mt-4 max-w-xl break-words text-base font-semibold leading-snug text-cyan-100 sm:text-lg">
            {evolutionMorphing && morphFromAura ? (
              <MorphingText
                from={morphFromCatchCopy ?? morphFromAura.catchCopy}
                to={oneLineCatch}
                active
                className="inline"
              />
            ) : (
              oneLineCatch
            )}
          </p>

          <div className="mt-4 flex max-w-full flex-wrap justify-center gap-2">
            {(heroTags.length > 0 ? heroTags : [t.aura.awaitingVotes]).map((word) => (
              <span
                key={word}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-bold"
              >
                #{word}
              </span>
            ))}
          </div>

          <div className="mt-5 w-full max-w-md rounded-2xl border border-fuchsia-300/45 bg-gradient-to-br from-fuchsia-500/25 via-rose-500/15 to-violet-500/20 px-4 py-3.5 text-center shadow-[0_0_28px_rgba(232,121,249,0.22)]">
            <p className="text-[11px] font-black tracking-[0.28em] text-fuchsia-100/90">
              💥 {t.aura.specialMove}
            </p>
            <p className="mt-1.5 break-words text-lg font-black leading-snug text-white sm:text-xl">
              {quoteWrap(profile.specialMove, locale)}
            </p>
          </div>

          <div className="mt-4 flex max-w-full flex-wrap justify-center gap-2">
            {topStatBadges.map((stat) => (
              <span
                key={stat.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: stat.color }} />
                {stat.short}
                <span className="tabular-nums text-white/90">{stat.value}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Bridge ========== */}
      <div className="relative flex flex-col items-center px-4 py-7">
        <div
          className="absolute inset-x-8 top-0 h-px sm:inset-x-16"
          style={{
            background: `linear-gradient(90deg, transparent, ${aura.palette.a}88, ${aura.palette.b}88, transparent)`,
          }}
        />
        <div
          className="mb-3 h-8 w-px"
          style={{
            background: `linear-gradient(180deg, ${aura.palette.a}aa, transparent)`,
          }}
        />
        <p className="font-display text-center text-2xl text-white/70 sm:text-3xl">
          {t.aura.auraManual}
        </p>
        <h3 className="mt-2 text-center text-lg font-black text-white sm:text-xl">
          {t.aura.manualTitle}
        </h3>
        <p className="mt-1 max-w-sm text-center text-xs text-white/55 sm:text-sm">
          {t.aura.manualSub}
        </p>
      </div>

      {/* ========== Deep reading: MBTI風トリセツ ========== */}
      <section
        className="min-w-0 space-y-5 rounded-3xl border border-white/15 bg-black/40 p-5 backdrop-blur sm:space-y-6 sm:p-7"
        style={
          {
            "--card-a": aura.palette.a,
            "--card-b": aura.palette.b,
            "--card-c": aura.palette.c,
          } as CSSProperties
        }
      >
        {profile.confidence !== "stable" ? (
          <p className="text-xs text-white/55">{profile.confidenceLabel}</p>
        ) : null}

        {/* 生態データ */}
        <div>
          <SectionLabel>{t.aura.ecology}</SectionLabel>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {ecologyRows.map((row) => (
              <div
                key={row.label}
                className={`rounded-2xl border p-3.5 ${
                  row.tone === "violet"
                    ? "border-violet-300/30 bg-violet-500/10"
                    : row.tone === "cyan"
                      ? "border-cyan-300/30 bg-cyan-500/10"
                      : row.tone === "amber"
                        ? "border-amber-300/30 bg-amber-500/10"
                        : "border-fuchsia-300/30 bg-fuchsia-500/10"
                }`}
              >
                <p
                  className={`text-[10px] font-bold tracking-wide ${
                    row.tone === "violet"
                      ? "text-violet-100/80"
                      : row.tone === "cyan"
                        ? "text-cyan-100/80"
                        : row.tone === "amber"
                          ? "text-amber-100/80"
                          : "text-fuchsia-100/80"
                  }`}
                >
                  {row.label}
                </p>
                <p className="mt-1.5 break-words text-sm font-semibold leading-snug text-white/90">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 周囲からの見え方 */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
          <SectionLabel>{t.aura.witness}</SectionLabel>
          <p className="mt-1 text-[11px] text-white/45">{t.aura.witnessSub}</p>
          <blockquote className="mt-3 border-l-2 border-cyan-300/50 pl-4">
            <p className="break-words text-sm leading-relaxed text-cyan-50/95 sm:text-base">
              {quoteWrap(profile.witnessText, locale)}
            </p>
          </blockquote>
        </div>

        {/* 二面性＆詳細解説 */}
        <div className="space-y-4">
          <div>
            <SectionLabel>{t.aura.duality}</SectionLabel>
            <p className="mt-1 text-[11px] text-white/45">{t.aura.dualityWhy}</p>
          </div>

          {profile.evidence.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-white/60">{t.aura.evidence}</p>
              <ul className="mt-2 space-y-2">
                {profile.evidence.slice(0, 5).map((item) => (
                  <li
                    key={item.word}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm font-semibold">#{item.word}</span>
                    <span className="text-xs tabular-nums text-white/70">
                      {item.count}
                      {t.aura.voteUnit}・{item.percent}%
                    </span>
                    {item.badge ? (
                      <span className="rounded-full border border-violet-300/40 bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-100">
                        {item.badge}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {profile.contradiction ? (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-amber-200">
                ⚠️ {t.aura.contradiction}
              </p>
              <p className="mt-2 text-sm font-semibold text-amber-100">
                {quoteWrap(profile.contradiction.wordA, locale)} ×{" "}
                {quoteWrap(profile.contradiction.wordB, locale)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-100/90">
                {profile.contradiction.text}
              </p>
            </div>
          ) : null}

          <div className="space-y-3 rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.06] to-transparent p-4 sm:p-5">
            <p className="break-words text-sm leading-relaxed text-white/85 sm:text-[15px] sm:leading-7">
              {profile.readingText}
            </p>
            {profile.shadowText ? (
              <p className="break-words text-sm leading-relaxed text-white/70 sm:text-[15px] sm:leading-7">
                {profile.shadowText}
              </p>
            ) : null}
          </div>
        </div>

        {/* 相性 */}
        <div>
          <SectionLabel>{t.aura.compat}</SectionLabel>
          <p className="mt-1 text-[11px] text-white/45">{t.aura.compatSub}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <CompatAuraTile
              kind="good"
              auraId={profile.compatibility.good.id}
              onOpen={() => openCompat("good")}
              locale={locale}
              t={t}
            />
            <CompatAuraTile
              kind="bad"
              auraId={profile.compatibility.bad.id}
              onOpen={() => openCompat("bad")}
              locale={locale}
              t={t}
            />
          </div>
        </div>

        {/* ステータス詳細・覚醒・占い */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
          <SectionLabel>{t.aura.stats}</SectionLabel>
          <div className="mt-3 space-y-2.5">
            {stats.map((stat) => (
              <StatBar
                key={stat.key}
                label={stat.label}
                value={profile.stats[stat.key]}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-200">{t.aura.awakening}</p>
            <span className="text-sm font-bold tabular-nums text-violet-100">
              {profile.awakening.percent}%
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 transition-all duration-500"
              style={{ width: `${profile.awakening.percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-violet-100/80">{profile.awakening.hint}</p>
        </div>

        <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">🌙 {t.aura.fortune}</p>
          <p className="mt-2 text-sm text-cyan-100">{profile.dailyFortune}</p>
        </div>
      </section>

      {compatPreview ? (
        <CompatibilityAuraModal
          preview={compatPreview}
          onClose={() => setCompatPreview(null)}
          locale={locale}
          t={t}
        />
      ) : null}
    </div>
  );
}
