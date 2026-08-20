import type { CSSProperties } from "react";
import type { AuraEcology, AuraType } from "@/lib/constants/auras";
import { RARITY_LABELS } from "@/lib/constants/auras";

type AuraCardProps = {
  aura: AuraType;
  catchCopy: string;
  description: string;
  ecology?: AuraEcology | null;
  topWords: string[];
  hasVotes: boolean;
  pulse?: boolean;
};

export default function AuraCard({
  aura,
  catchCopy,
  description,
  ecology,
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
      <div className="grid min-w-0 items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
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

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold tracking-[0.25em] text-violet-200 sm:text-sm">AURA RESULT</p>
            <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold">
              {RARITY_LABELS[aura.rarity]}
            </span>
          </div>
          <h2 className="mt-3 break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">{aura.name}</h2>
          <p className="mt-3 break-words text-base text-cyan-100 sm:text-lg">{catchCopy}</p>
          <p className="mt-4 break-words text-sm text-white/80 sm:text-base">{description}</p>

          {ecology ? (
            <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-violet-200">生態データ</p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/75">
                <li>
                  <span className="font-semibold text-cyan-100/90">⚡ 発動条件:</span> {ecology.trigger}
                </li>
                <li>
                  <span className="font-semibold text-cyan-100/90">💥 副作用:</span> {ecology.sideEffect}
                </li>
                <li>
                  <span className="font-semibold text-cyan-100/90">🩹 弱点:</span> {ecology.weakness}
                </li>
              </ul>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
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
