"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { AuraType, DynamicAuraProfile } from "@/lib/constants/auras";
import { getAuraById, getAuraLineage, RARITY_LABELS, SECRET_FLAVOR } from "@/lib/constants/auras";

type AuraCardProps = {
  aura: AuraType;
  catchCopy: string;
  profile: DynamicAuraProfile;
  topWords: string[];
  hasVotes: boolean;
  pulse?: boolean;
  displayName?: string;
};

const STAT_META = [
  { key: "social" as const, label: "社交力", short: "社交", color: "#fbbf24" },
  { key: "neta" as const, label: "ネタ力", short: "ネタ", color: "#e879f9" },
  { key: "mystic" as const, label: "神秘度", short: "神秘", color: "#818cf8" },
  { key: "heal" as const, label: "癒し力", short: "癒し", color: "#6ee7b7" },
  { key: "gap" as const, label: "ギャップ", short: "ギャップ", color: "#22d3ee" },
];

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

function CompatibilityAuraModal({
  preview,
  onClose,
}: {
  preview: CompatPreview;
  onClose: () => void;
}) {
  const { aura, kind } = preview;
  const isSecret = aura.rarity === "secret";
  const lineage = getAuraLineage(aura.id);

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
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/20 bg-zinc-950 p-5 text-white shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-xs font-semibold tracking-[0.18em] ${
              kind === "good" ? "text-emerald-200" : "text-rose-200"
            }`}
          >
            {kind === "good" ? "🔗 相性の良いオーラ" : "⚔️ 危険なオーラ"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70"
          >
            閉じる
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center text-center">
          {isSecret ? (
            <div className="relative h-24 w-24 rounded-full border border-violet-400/40 bg-zinc-950 shadow-[0_0_28px_rgba(124,58,237,0.45)]">
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-violet-200/80">
                ?
              </div>
            </div>
          ) : (
            <div
              className="h-24 w-24 rounded-full border border-white/20 shadow-lg"
              style={{
                background: aura.gradient,
                boxShadow: `0 0 28px ${aura.palette.a}66`,
              }}
            />
          )}

          <span className="mt-4 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">
            {RARITY_LABELS[aura.rarity]}
          </span>
          {lineage ? (
            <p className="mt-2 text-[11px] font-semibold tracking-[0.18em]" style={{ color: lineage.accent }}>
              {lineage.name}
            </p>
          ) : null}
          <h3 className="mt-2 break-words text-2xl font-black leading-tight">
            {isSecret ? "？？？（シークレット）" : aura.archetypeName}
          </h3>
          {!isSecret ? (
            <p className="mt-1 break-words text-sm text-white/55">{aura.name}</p>
          ) : null}
          <p className="mt-3 break-words text-sm text-cyan-100/90">
            {isSecret ? "条件は明かされない、幻の光。" : aura.catchCopy}
          </p>
          <p className="mt-3 break-words text-sm leading-relaxed text-white/75">
            {isSecret ? SECRET_FLAVOR : aura.description}
          </p>
          {!isSecret && aura.keywords.length > 0 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {aura.keywords.slice(0, 6).map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80"
                >
                  #{word}
                </span>
              ))}
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
}: AuraCardProps) {
  const [compatPreview, setCompatPreview] = useState<CompatPreview | null>(null);

  function openCompat(kind: "good" | "bad") {
    const targetId = kind === "good" ? profile.compatibility.good.id : profile.compatibility.bad.id;
    const target = getAuraById(targetId);
    if (!target) return;
    setCompatPreview({ kind, aura: target });
  }

  const heroTags =
    profile.evidence.length > 0
      ? profile.evidence.slice(0, 3).map((item) => item.word)
      : topWords.slice(0, 3);

  const oneLineCatch = aura.catchCopy || catchCopy;

  const topStatBadges = [...STAT_META]
    .map((stat) => ({ ...stat, value: profile.stats[stat.key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const ecologyRows = [
    { label: "生息地", value: profile.ecology.habitat, tone: "violet" as const },
    { label: "発動条件", value: profile.ecology.trigger, tone: "cyan" as const },
    { label: "弱点", value: profile.ecology.weakness, tone: "amber" as const },
    { label: "周囲への副作用", value: profile.ecology.sideEffect, tone: "fuchsia" as const },
  ];

  return (
    <div className="min-w-0 space-y-0">
      {/* ========== First View: スクショ映え ========== */}
      <section
        className="min-w-0 rounded-3xl border border-white/20 bg-black/35 p-5 backdrop-blur sm:p-8"
        style={
          {
            "--card-a": aura.palette.a,
            "--card-b": aura.palette.b,
            "--card-c": aura.palette.c,
          } as CSSProperties
        }
      >
        <div className="flex flex-col items-center text-center">
          {displayName ? (
            <p className="text-sm font-semibold text-white/70 sm:text-base">{displayName}</p>
          ) : null}

          <div className="relative mt-3 h-40 w-40 sm:mt-4 sm:h-56 sm:w-56">
            <div className={`aura-card-halo ${pulse ? "aura-card-halo-pulse" : ""}`} />
            <div className="aura-card-ring aura-card-ring-a" />
            <div className="aura-card-ring aura-card-ring-b" />
            <div className={`aura-card-core ${hasVotes ? "" : "aura-card-core-dormant"}`} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">
              {RARITY_LABELS[aura.rarity]}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                profile.confidence === "provisional"
                  ? "border-amber-300/50 bg-amber-500/20 text-amber-100"
                  : profile.confidence === "growing"
                    ? "border-cyan-300/40 bg-cyan-500/15 text-cyan-100"
                    : "border-emerald-300/40 bg-emerald-500/15 text-emerald-100"
              }`}
            >
              {profile.confidence === "provisional"
                ? "暫定"
                : profile.confidence === "growing"
                  ? "育ち中"
                  : "安定"}
            </span>
          </div>

          <p className="mt-4 text-[11px] font-bold tracking-[0.28em] text-white/45">通り名</p>
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
            {aura.archetypeName}
          </h2>
          <p className="mt-1 break-words text-xs font-medium text-white/50 sm:text-sm">{aura.name}</p>

          <p className="mt-4 max-w-xl break-words text-base font-semibold leading-snug text-cyan-100 sm:text-lg">
            {oneLineCatch}
          </p>

          <div className="mt-4 flex max-w-full flex-wrap justify-center gap-2">
            {(heroTags.length > 0 ? heroTags : ["覚醒待ち"]).map((word) => (
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
              💥 必殺技
            </p>
            <p className="mt-1.5 break-words text-lg font-black leading-snug text-white sm:text-xl">
              「{profile.specialMove}」
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
        <p className="text-center text-[11px] font-bold tracking-[0.28em] text-white/50">
          AURA MANUAL
        </p>
        <h3 className="mt-2 text-center text-lg font-black text-white sm:text-xl">
          あなたのオーラ取扱説明書
        </h3>
        <p className="mt-1 max-w-sm text-center text-xs text-white/55 sm:text-sm">
          当たりすぎ注意。スクロールして熟読してください。
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
          <SectionLabel>生態データ</SectionLabel>
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
          <SectionLabel>周囲からのリアルな見え方</SectionLabel>
          <p className="mt-1 text-[11px] text-white/45">友達目線・証言風</p>
          <blockquote className="mt-3 border-l-2 border-cyan-300/50 pl-4">
            <p className="break-words text-sm leading-relaxed text-cyan-50/95 sm:text-base">
              「{profile.witnessText}」
            </p>
          </blockquote>
        </div>

        {/* 二面性＆詳細解説 */}
        <div className="space-y-4">
          <div>
            <SectionLabel>二面性分析＆詳細解説</SectionLabel>
            <p className="mt-1 text-[11px] text-white/45">なぜこのオーラになったのか</p>
          </div>

          {profile.evidence.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-white/60">診断の決め手（票の根拠）</p>
              <ul className="mt-2 space-y-2">
                {profile.evidence.slice(0, 5).map((item) => (
                  <li
                    key={item.word}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm font-semibold">#{item.word}</span>
                    <span className="text-xs tabular-nums text-white/70">
                      {item.count}票・{item.percent}%
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
              <p className="text-xs font-semibold tracking-[0.18em] text-amber-200">⚠️ 票の割れ・矛盾検出</p>
              <p className="mt-2 text-sm font-semibold text-amber-100">
                「{profile.contradiction.wordA}」×「{profile.contradiction.wordB}」
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
          <SectionLabel>相性診断</SectionLabel>
          <p className="mt-1 text-[11px] text-white/45">友達同士で結果を見せ合うフック</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => openCompat("good")}
              className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-left transition hover:border-emerald-300/50 hover:bg-emerald-500/15 active:scale-[0.99]"
            >
              <p className="text-xs font-semibold text-emerald-200">🔗 相性の良いオーラ</p>
              <p className="mt-2 break-words text-base font-bold text-emerald-100">
                {profile.compatibility.good.name}
              </p>
              <p className="mt-2 text-[11px] text-emerald-100/60">
                {profile.compatibility.good.name === "？？？"
                  ? "タップでヒントを見る"
                  : "タップで特徴を見る"}
              </p>
            </button>
            <button
              type="button"
              onClick={() => openCompat("bad")}
              className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-left transition hover:border-rose-300/50 hover:bg-rose-500/15 active:scale-[0.99]"
            >
              <p className="text-xs font-semibold text-rose-200">⚔️ 危険なオーラ</p>
              <p className="mt-2 break-words text-base font-bold text-rose-100">
                {profile.compatibility.bad.name}
              </p>
              <p className="mt-2 text-[11px] text-rose-100/60">
                {profile.compatibility.bad.name === "？？？"
                  ? "タップでヒントを見る"
                  : "タップで特徴を見る"}
              </p>
            </button>
          </div>
        </div>

        {/* ステータス詳細・覚醒・占い */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
          <SectionLabel>ステータス詳細</SectionLabel>
          <div className="mt-3 space-y-2.5">
            {STAT_META.map((stat) => (
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
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-200">覚醒度</p>
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
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">🌙 今日のオーラ占い</p>
          <p className="mt-2 text-sm text-cyan-100">{profile.dailyFortune}</p>
        </div>
      </section>

      {compatPreview ? (
        <CompatibilityAuraModal preview={compatPreview} onClose={() => setCompatPreview(null)} />
      ) : null}
    </div>
  );
}
