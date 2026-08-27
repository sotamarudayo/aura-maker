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
    const timer = window.setTimeout(() => setPhase("reveal"), 1100);
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
    }, 2600);
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
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="オーラ進化"
    >
      {/* soft backdrop glow from current / next aura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            phase === "reveal"
              ? `radial-gradient(circle at 50% 42%, ${toAura.palette.a}55 0%, transparent 55%)`
              : `radial-gradient(circle at 50% 42%, ${fromAura.palette.a}44 0%, transparent 55%)`,
        }}
      />

      {phase === "flash" ? (
        <div className="aura-evolve-flash pointer-events-none absolute inset-0 z-30" />
      ) : null}

      {phase === "ready" ? (
        <button
          type="button"
          onClick={startEvolution}
          className="relative z-10 flex w-full max-w-md flex-col items-center px-6 py-10 text-center text-white outline-none"
        >
          <p className="aura-evolve-title text-sm font-black tracking-[0.35em] text-white/90 sm:text-base">
            CHANGE YOUR AURA
          </p>
          <p className="mt-3 text-sm text-white/55">オーラが変わろうとしている</p>

          <div className="relative mx-auto mt-10 h-44 w-44 sm:h-52 sm:w-52">
            <div
              className="aura-evolve-orb absolute inset-0 rounded-full"
              style={{
                background: fromAura.gradient,
                boxShadow: `0 0 48px ${fromAura.palette.a}88, 0 0 96px ${fromAura.palette.b}44`,
              }}
            />
            <div className="aura-evolve-orb-ring pointer-events-none absolute -inset-3 rounded-full border border-white/20" />
            <div className="aura-evolve-orb-ring-slow pointer-events-none absolute -inset-6 rounded-full border border-white/10" />
            <span className="aura-evolve-tap absolute inset-0 flex items-center justify-center text-3xl font-black tracking-[0.2em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-4xl">
              TAP
            </span>
          </div>

          <p className="mt-8 text-lg font-bold text-white/80">{fromAura.archetypeName}</p>
          <p className="mt-6 text-xs tracking-[0.18em] text-white/40">画面をタップして変身</p>
        </button>
      ) : null}

      {phase === "flash" ? (
        <div className="relative z-10 flex flex-col items-center opacity-0" aria-hidden>
          <div
            className="h-44 w-44 rounded-full sm:h-52 sm:w-52"
            style={{ background: toAura.gradient }}
          />
        </div>
      ) : null}

      {phase === "reveal" ? (
        <div className="aura-evolve-reveal relative z-10 flex w-full max-w-md flex-col items-center px-6 py-10 text-center text-white">
          <p
            className={`text-sm font-black tracking-[0.32em] sm:text-base ${
              isSecret ? "text-violet-200" : "text-amber-100"
            }`}
          >
            {isSecret ? "SECRET AWAKENED" : "AURA CHANGED"}
          </p>

          <div className="relative mx-auto mt-10 h-44 w-44 sm:h-52 sm:w-52">
            <div
              className="h-full w-full rounded-full border border-white/30"
              style={{
                background: isSecret
                  ? "radial-gradient(circle at 30% 30%, #a78bfa, #4c1d95 50%, #0b0618 100%)"
                  : toAura.gradient,
                boxShadow: `0 0 56px ${toAura.palette.a}aa, 0 0 110px ${toAura.palette.b}55`,
              }}
            />
          </div>

          <span
            className={`mt-6 inline-block rounded-full border px-3 py-1 text-xs font-bold ${
              isSecret
                ? "border-violet-300/60 bg-violet-500/25 text-violet-100"
                : "border-amber-300/50 bg-amber-400/20 text-amber-100"
            }`}
          >
            {RARITY_LABELS[toAura.rarity]}
            {!isSecret ? " · 覚醒" : ""}
          </span>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{toAura.archetypeName}</h2>
          <p className="mt-2 text-sm text-white/65">{toAura.name}</p>
        </div>
      ) : null}
    </div>
  );
}
