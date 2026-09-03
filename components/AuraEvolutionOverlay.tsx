"use client";

import { useEffect, useRef, useState } from "react";
import type { AuraType } from "@/lib/constants/auras";
import { useLocale } from "@/components/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

type EvolutionPhase = "ask" | "ready" | "morphing";

type AuraEvolutionOverlayProps = {
  fromAura: AuraType;
  toAura: AuraType;
  /** モーフィング開始時にカードの中身を差し替える（色・文字はカード側でじわっと遷移） */
  onReveal: () => void;
  /** モーフィング終了後に進化待ちを閉じる */
  onComplete: () => void;
  /** 「まだ待って」でカード上の進化ボタン待ちに入ったとき */
  onDeferTap?: () => void;
  /** カードの「進化する」押下で増えるトークン（ready 中のみ反応） */
  evolveToken?: number;
};

const MORPH_MS = 3000;

/**
 * 進化確認ポップ → 「まだ待って」ならカード上の「進化する」待ち → 「はい」なら即モーフィング。
 * 演出は真の輝き（core-pulse）。取扱説明書以降は演出対象外。
 */
export default function AuraEvolutionOverlay({
  fromAura,
  toAura,
  onReveal,
  onComplete,
  onDeferTap,
  evolveToken = 0,
}: AuraEvolutionOverlayProps) {
  const { t } = useLocale();
  const [phase, setPhase] = useState<EvolutionPhase>("ask");
  const fromAuraRef = useRef(fromAura);
  const toAuraRef = useRef(toAura);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  const onDeferTapRef = useRef(onDeferTap);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;
  onDeferTapRef.current = onDeferTap;
  const startedRef = useRef(false);
  const lastEvolveTokenRef = useRef(evolveToken);

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
        style: "core-pulse",
      });
      onCompleteRef.current();
    }, MORPH_MS);

    return () => window.clearTimeout(doneTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") {
      lastEvolveTokenRef.current = evolveToken;
      return;
    }
    if (evolveToken === lastEvolveTokenRef.current) return;
    lastEvolveTokenRef.current = evolveToken;
    trackEvent("aura_evolution_start", {
      from: fromAuraRef.current.id,
      to: toAuraRef.current.id,
      secret: toAuraRef.current.rarity === "secret",
      style: "core-pulse",
      source: "button",
    });
    setPhase("morphing");
  }, [evolveToken, phase]);

  function startEvolution(source: "prompt_yes" | "button") {
    if (phase === "morphing") return;
    trackEvent("aura_evolution_start", {
      from: fromAuraRef.current.id,
      to: toAuraRef.current.id,
      secret: toAuraRef.current.rarity === "secret",
      style: "core-pulse",
      source,
    });
    setPhase("morphing");
  }

  function waitForButton() {
    trackEvent("aura_evolution_deferred", {
      from: fromAuraRef.current.id,
      to: toAuraRef.current.id,
    });
    setPhase("ready");
    onDeferTapRef.current?.();
  }

  if (phase === "ask") {
    return (
      <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/70 px-4 pb-8 sm:items-center sm:pb-0">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="evolution-nudge-title"
          className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-5 text-white shadow-2xl sm:p-6"
        >
          <h2 id="evolution-nudge-title" className="text-xl font-black leading-snug sm:text-2xl">
            {t.dashboard.evolutionNudgeTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{t.dashboard.evolutionNudgeSub}</p>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => startEvolution("prompt_yes")}
              className="min-h-12 rounded-2xl bg-violet-300 px-5 py-3 text-base font-black text-black"
            >
              {t.dashboard.evolutionNudgeYes}
            </button>
            <button
              type="button"
              onClick={waitForButton}
              className="min-h-12 rounded-2xl border border-white/25 bg-white/5 px-5 py-3 text-base font-semibold text-white/85"
            >
              {t.dashboard.evolutionNudgeWait}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ready / morphing: カード上の「進化する」ボタン側で開始。全画面オーバーレイは置かない
  return null;
}
