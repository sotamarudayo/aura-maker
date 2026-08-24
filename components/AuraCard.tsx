"use client";

import type { CSSProperties } from "react";
import type { AuraType, DynamicAuraProfile } from "@/lib/constants/auras";
import { RARITY_LABELS } from "@/lib/constants/auras";

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

export default function AuraCard({
  aura,
  catchCopy,
  profile,
  topWords,
  hasVotes,
  pulse = false,
}: AuraCardProps) {
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
        <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
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

        <div className="min-w-0 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-violet-200 sm:text-sm">
                AURA RESULT
              </p>
              <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold">
                {RARITY_LABELS[aura.rarity]}
              </span>
            </div>
            <h2 className="mt-3 break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
              {aura.name}
            </h2>
            <p className="mt-3 break-words text-base text-cyan-100 sm:text-lg">{catchCopy}</p>
            <p className="mt-4 break-words text-sm text-white/80 sm:text-base">{profile.mainText}</p>
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
            <ul className="mt-2 space-y-1.5 text-sm text-white/75">
              <li>
                <span className="font-semibold text-cyan-100/90">⚡ 発動条件:</span>{" "}
                {profile.ecology.trigger}
              </li>
              <li>
                <span className="font-semibold text-cyan-100/90">💥 副作用:</span>{" "}
                {profile.ecology.sideEffect}
              </li>
              <li>
                <span className="font-semibold text-cyan-100/90">🩹 弱点:</span>{" "}
                {profile.ecology.weakness}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200">💥 必殺技</p>
            <p className="mt-2 text-base font-bold text-fuchsia-100">「{profile.specialMove}」</p>
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
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
              <p className="text-xs font-semibold text-emerald-200">🔗 相性の良いオーラ</p>
              <p className="mt-1 text-sm font-semibold text-emerald-100">
                {profile.compatibility.good.name}
              </p>
            </div>
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3">
              <p className="text-xs font-semibold text-rose-200">⚔️ 相克オーラ</p>
              <p className="mt-1 text-sm font-semibold text-rose-100">
                {profile.compatibility.bad.name}
              </p>
            </div>
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

          <div className="flex flex-wrap gap-2">
            {topWords.length > 0 ? (
              topWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold"
                >
                  #{word}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold text-white/70">
                #覚醒待ち
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
