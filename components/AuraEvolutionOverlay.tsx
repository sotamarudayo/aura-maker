"use client";

import { useEffect, useRef, useState } from "react";
import type { AuraType } from "@/lib/constants/auras";
import { RARITY_LABELS } from "@/lib/constants/auras";
import { trackEvent } from "@/lib/analytics";

type EvolutionPhase = "ready" | "flash" | "reveal";

type AuraEvolutionOverlayProps = {
  fromAura: AuraType;
  toAura: AuraType;
  onComplete: () => void;
};

export default function AuraEvolutionOverlay({
  fromAura,
  toAura,
  onComplete,
}: AuraEvolutionOverlayProps) {
  const [phase, setPhase] = useState<EvolutionPhase>("ready");
  const isSecret = toAura.rarity === "secret";
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (phase !== "flash") return;
    const timer = window.setTimeout(() => setPhase("reveal"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const timer = window.setTimeout(() => {
      trackEvent("aura_evolution_complete", {
        from: fromAura.id,
        to: toAura.id,
        secret: isSecret,
      });
      onCompleteRef.current();
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [phase, fromAura.id, toAura.id, isSecret]);

  function startEvolution() {
    if (phase !== "ready") return;
    trackEvent("aura_evolution_start", {
      from: fromAura.id,
      to: toAura.id,
      secret: isSecret,
    });
    setPhase("flash");
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="オーラ進化"
    >
      {phase === "flash" ? (
        <div className="aura-evolve-flash pointer-events-none absolute inset-0" />
      ) : null}

      <div className="relative z-10 w-full max-w-sm text-center text-white">
        {phase === "ready" ? (
          <button
            type="button"
            onClick={startEvolution}
            className="w-full rounded-3xl border border-white/25 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur transition hover:border-white/40"
          >
            <p className="text-xs font-bold tracking-[0.28em] text-violet-200">AURA EVOLUTION</p>
            <p className="mt-3 text-sm text-white/70">オーラに変化の兆しがある…</p>

            <div className="relative mx-auto mt-6 h-28 w-28">
              <div
                className="h-full w-full rounded-full border border-white/20 shadow-lg"
                style={{
                  background: fromAura.gradient,
                  boxShadow: `0 0 28px ${fromAura.palette.a}66`,
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-black text-white/25">
                ?
              </div>
            </div>

            <p className="mt-4 text-lg font-black">{fromAura.archetypeName}</p>
            <p className="mt-6 rounded-2xl bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black">
              タップして進化させる
            </p>
            <p className="mt-3 text-xs text-white/45">ポケモンの進化みたいな瞬間、撮ってね</p>
          </button>
        ) : null}

        {phase === "reveal" ? (
          <div className="aura-evolve-reveal rounded-3xl border border-white/25 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur">
            <p
              className={`text-xs font-bold tracking-[0.28em] ${
                isSecret ? "text-violet-200" : "text-amber-200"
              }`}
            >
              {isSecret ? "SECRET AWAKENED" : "AURA EVOLVED"}
            </p>
            <div
              className="relative mx-auto mt-6 h-32 w-32 rounded-full border border-white/25"
              style={{
                background: isSecret
                  ? "radial-gradient(circle at 30% 30%, #7c3aed, #1e1b4b 55%, #05030b 100%)"
                  : toAura.gradient,
                boxShadow: `0 0 40px ${toAura.palette.a}88`,
              }}
            >
              {isSecret ? (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-violet-100/90">
                  !
                </div>
              ) : null}
            </div>
            <span
              className={`mt-4 inline-block rounded-full border px-3 py-1 text-xs font-bold ${
                isSecret
                  ? "border-violet-300/60 bg-violet-500/25 text-violet-100"
                  : "border-amber-300/50 bg-amber-400/20 text-amber-100"
              }`}
            >
              {RARITY_LABELS[toAura.rarity]}
              {!isSecret ? " · 覚醒" : ""}
            </span>
            <h2 className="mt-3 text-3xl font-black leading-tight">{toAura.archetypeName}</h2>
            <p className="mt-2 text-sm text-white/65">{toAura.name}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
