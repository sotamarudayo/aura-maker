"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { AuraType, DynamicAuraProfile } from "@/lib/constants/auras";
import { getAuraById, getAuraLineage, RARITY_LABELS, SECRET_FLAVOR } from "@/lib/constants/auras";

type AuraCardProps = {
  aura: AuraType;
  catchCopy: string;
  profile: DynamicAuraProfile;
  topWords: string[];
  hasVotes: boolean;
  pulse?: boolean;
};

const STAT_META = [
  { key: "social" as const, label: "社交力", color: "#fbbf24" },
  { key: "neta" as const, label: "ネタ力", color: "#e879f9" },
  { key: "mystic" as const, label: "神秘度", color: "#818cf8" },
  { key: "heal" as const, label: "癒し力", color: "#6ee7b7" },
  { key: "gap" as const, label: "ギャップ", color: "#22d3ee" },
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
            {kind === "good" ? "🔗 相性の良いオーラ" : "⚔️ 相克オーラ"}
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

export default function AuraCard({
  aura,
  catchCopy,
  profile,
  topWords,
  hasVotes,
  pulse = false,
}: AuraCardProps) {
  const [compatPreview, setCompatPreview] = useState<CompatPreview | null>(null);

  function openCompat(kind: "good" | "bad") {
    const targetId = kind === "good" ? profile.compatibility.good.id : profile.compatibility.bad.id;
    const target = getAuraById(targetId);
    if (!target) return;
    setCompatPreview({ kind, aura: target });
  }

  return (
    <section
      className="min-w-0 rounded-3xl border border-white/20 bg-black/35 p-4 backdrop-blur sm:p-6 md:p-8"
      style={
        {
          "--card-a": aura.palette.a,
          "--card-b": aura.palette.b,
          "--card-c": aura.palette.c,
        } as CSSProperties
      }
    >
      <div className="grid min-w-0 items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="mx-auto flex w-full max-w-[20rem] flex-col items-center gap-3 sm:max-w-none">
          <p
            className="max-w-[90%] break-words rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-center text-xs font-bold tracking-wide text-white/90 shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:text-sm"
            style={{
              boxShadow: `0 0 28px ${aura.palette.a}44`,
              borderColor: `${aura.palette.a}66`,
            }}
          >
            {aura.name}
          </p>
          <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
            <div className={`aura-card-halo ${pulse ? "aura-card-halo-pulse" : ""}`} />
            <div className="aura-card-ring aura-card-ring-a" />
            <div className="aura-card-ring aura-card-ring-b" />
            <div className={`aura-card-core ${hasVotes ? "" : "aura-card-core-dormant"}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-white/35 bg-black/35 px-4 py-2 text-xs font-semibold tracking-widest text-white/90">
                {hasVotes ? "AURA ACTIVE" : "AURA DORMANT"}
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-violet-200 sm:text-sm">
                AURA RESULT
              </p>
              <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold">
                {RARITY_LABELS[aura.rarity]}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
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
            {profile.confidence !== "stable" ? (
              <p className="mt-2 text-xs text-white/60">{profile.confidenceLabel}</p>
            ) : null}
            <p className="mt-4 text-[11px] font-bold tracking-[0.28em] text-white/45">通り名</p>
            <h2
              className="mt-1 break-words text-[clamp(1.75rem,8vw,4.5rem)] font-black leading-[1.08] tracking-tight"
              style={{
                backgroundImage: `linear-gradient(120deg, #fff 0%, ${aura.palette.a} 42%, ${aura.palette.b} 78%, ${aura.palette.c} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: `drop-shadow(0 0 28px ${aura.palette.a}66)`,
              }}
            >
              {aura.archetypeName}
            </h2>
            <p className="mt-3 break-words text-base text-cyan-100 sm:text-lg">{catchCopy}</p>
            {profile.evidence.length > 0 ? (
              <div className="mt-4">
                <p className="text-[11px] font-bold tracking-[0.2em] text-white/45">診断の決め手</p>
                <ul className="mt-2 space-y-2">
                  {profile.evidence.slice(0, 3).map((item) => (
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
            ) : topWords.length > 0 ? (
              <div className="mt-4">
                <p className="text-[11px] font-bold tracking-[0.2em] text-white/45">診断の決め手</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topWords.map((word) => (
                    <span
                      key={word}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold"
                    >
                      #{word}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-4 space-y-3">
              <p className="text-[11px] font-bold tracking-[0.2em] text-white/45">診断レポート</p>
              {profile.mainText.split("\n\n").map((paragraph, index) => (
                <p key={index} className="break-words text-sm leading-relaxed text-white/80 sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {profile.contradiction ? (
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-amber-200">⚠️ 矛盾検出</p>
              <p className="mt-2 text-sm font-semibold text-amber-100">
                「{profile.contradiction.wordA}」×「{profile.contradiction.wordB}」
              </p>
              <p className="mt-1 text-sm text-amber-100/85">{profile.contradiction.text}</p>
            </div>
          ) : null}

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-200">生態データ</p>
            <p className="mt-1 text-xs text-white/50">通り名と上位ワードから読み解いた行動パターン</p>
            <ul className="mt-2 space-y-1.5 text-sm text-white/75">
              <li>
                <span className="font-semibold text-cyan-100/90">⚡ 発動しやすい場面:</span>{" "}
                {profile.ecology.trigger}
              </li>
              <li>
                <span className="font-semibold text-cyan-100/90">💥 周りへの影響:</span>{" "}
                {profile.ecology.sideEffect}
              </li>
              <li>
                <span className="font-semibold text-cyan-100/90">🩹 つまずきやすい点:</span>{" "}
                {profile.ecology.weakness}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200">💥 必殺技</p>
            <p className="mt-2 break-words text-base font-bold leading-snug text-fuchsia-100 sm:text-lg">
              「{profile.specialMove}」
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-200">ステータス</p>
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

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => openCompat("good")}
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-left transition hover:border-emerald-300/50 hover:bg-emerald-500/15 active:scale-[0.99]"
            >
              <p className="text-xs font-semibold text-emerald-200">🔗 相性の良いオーラ</p>
              <p className="mt-1 break-words text-sm font-semibold text-emerald-100">
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
              className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-left transition hover:border-rose-300/50 hover:bg-rose-500/15 active:scale-[0.99]"
            >
              <p className="text-xs font-semibold text-rose-200">⚔️ 相克オーラ</p>
              <p className="mt-1 break-words text-sm font-semibold text-rose-100">
                {profile.compatibility.bad.name}
              </p>
              <p className="mt-2 text-[11px] text-rose-100/60">
                {profile.compatibility.bad.name === "？？？"
                  ? "タップでヒントを見る"
                  : "タップで特徴を見る"}
              </p>
            </button>
          </div>

          <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-4">
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

          <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">🌙 今日のオーラ占い</p>
            <p className="mt-2 text-sm text-cyan-100">{profile.dailyFortune}</p>
          </div>

          {topWords.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold text-white/70">
                #覚醒待ち
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {compatPreview ? (
        <CompatibilityAuraModal preview={compatPreview} onClose={() => setCompatPreview(null)} />
      ) : null}
    </section>
  );
}
