"use client";

import { useEffect, useRef, useState } from "react";
import type { AuraType } from "@/lib/constants/auras";
import { trackEvent } from "@/lib/analytics";

type EvolutionPhase = "ready" | "morphing";

type AuraEvolutionOverlayProps = {
  fromAura: AuraType;
  toAura: AuraType;
  /** モーフィング開始時にカードの中身を差し替える（色・文字はカード側でじわっと遷移） */
  onReveal: () => void;
  /** モーフィング終了後に進化待ちを閉じる */
  onComplete: () => void;
};

const MORPH_MS = 3200;

/**
 * 白フラッシュなし。タップでカード上部の色・目立つ文言をじわっと変化させる。
 * 取扱説明書以降は演出対象外（データ差し替えのみ）。
 */
export default function AuraEvolutionOverlay({
  fromAura,
  toAura,
  onReveal,
  onComplete,
}: AuraEvolutionOverlayProps) {
  const [phase, setPhase] = useState<EvolutionPhase>("ready");
  const fromAuraRef = useRef(fromAura);
  const toAuraRef = useRef(toAura);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;
  const startedRef = useRef(false);

  useEffect(() => {
    if (phase !== "morphing") return;

    if (!startedRef.current) {
      startedRef.current = true;
      onRevealRef.current();
    }

    const doneTimer = window.setTimeout(() => {
      trackEvent("aura_evolution_complete", {
        from: fromAuraRef.current.id,
        to: toAuraRef.current.id,
        secret: toAuraRef.current.rarity === "secret",
        style: "morph",
      });
      onCompleteRef.current();
    }, MORPH_MS);

    return () => window.clearTimeout(doneTimer);
  }, [phase]);

  function startEvolution() {
    if (phase !== "ready") return;
    trackEvent("aura_evolution_start", {
      from: fromAuraRef.current.id,
      to: toAuraRef.current.id,
      secret: toAuraRef.current.rarity === "secret",
      style: "morph",
    });
    setPhase("morphing");
  }

  return phase === "ready" ? (
    <button
      type="button"
      onClick={startEvolution}
      className="fixed inset-0 z-[75] cursor-pointer bg-transparent"
      aria-label="タップしてオーラを変化させる"
    >
      <span className="sr-only">Change Your Aura — Tap</span>
    </button>
  ) : null;
}

export type AuraEvolutionPromptProps = {
  active: boolean;
};

/** オーラカードのオーブ中央に重ねる Tap */
export function AuraEvolutionPrompt({ active }: AuraEvolutionPromptProps) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <span className="aura-evolve-tap font-display text-lg text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:text-xl">
        Tap
      </span>
    </div>
  );
}
