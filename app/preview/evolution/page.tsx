"use client";

import { useMemo, useState } from "react";
import AuraCard from "@/components/AuraCard";
import AuraEvolutionOverlay from "@/components/AuraEvolutionOverlay";
import {
  generateDynamicDescription,
  getAuraById,
  type AuraCalculationResult,
  type AuraType,
} from "@/lib/constants/auras";

const FROM = getAuraById("healing-mint")!;
const TO = getAuraById("chaos-neon")!;

function mockResult(
  aura: typeof FROM,
  words: string[],
): AuraCalculationResult {
  const votes = Array.from({ length: 4 }, () => words).flat();
  return {
    aura,
    topWords: words,
    personalizedCatchCopy: aura.catchCopy,
    dynamicProfile: generateDynamicDescription(aura, words, votes, {
      userId: "preview",
      displayName: "プレビュー",
    }),
  };
}

/**
 * 進化演出の確認用。白フラッシュなしで、色と文字がじわっと変化する版。
 * /preview/evolution
 */
export default function EvolutionPreviewPage() {
  const fromResult = useMemo(
    () => mockResult(FROM, ["癒やし枠", "透明感", "ミステリアス"]),
    [],
  );
  const toResult = useMemo(
    () => mockResult(TO, ["陽キャバイブス", "天才的バカ", "深夜テンション"]),
    [],
  );
  const [displayed, setDisplayed] = useState(fromResult);
  const [pending, setPending] = useState<AuraCalculationResult | null>(toResult);
  const [morphing, setMorphing] = useState(false);
  const [morphFrom, setMorphFrom] = useState<AuraType | null>(null);
  const [morphFromCatch, setMorphFromCatch] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const visible = displayed;
  const isAwakened = visible.dynamicProfile.awakening.unlocked;

  return (
    <main className="relative min-h-screen overflow-x-clip bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="text-center">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">Preview</p>
          <h1 className="mt-2 text-2xl font-black">オーラ進化演出</h1>
          <p className="mt-2 text-sm text-white/60">
            上部カードのみ：色がじわっと変化＋通り名・キャッチが一文字ずつ切り替わる
          </p>
          <p className="mt-1 text-sm text-white/60">
            {FROM.archetypeName} → {TO.archetypeName}
          </p>
          <button
            type="button"
            onClick={() => {
              setDisplayed(fromResult);
              setPending(toResult);
              setMorphing(false);
              setMorphFrom(null);
              setMorphFromCatch(null);
              setKey((k) => k + 1);
            }}
            className="mt-4 rounded-full bg-violet-300 px-5 py-2.5 text-sm font-bold text-black"
          >
            もう一度見る
          </button>
        </div>

        <AuraCard
          aura={visible.aura}
          catchCopy={visible.personalizedCatchCopy}
          profile={visible.dynamicProfile}
          topWords={visible.topWords}
          hasVotes
          displayName="プレビュー"
          awakened={isAwakened}
          evolutionPending={Boolean(pending)}
          evolutionMorphing={morphing}
          morphFromAura={morphFrom}
          morphFromCatchCopy={morphFromCatch}
        />
      </div>

      {pending ? (
        <AuraEvolutionOverlay
          key={key}
          fromAura={morphFrom ?? fromResult.aura}
          toAura={toResult.aura}
          onReveal={() => {
            setMorphFrom(displayed.aura);
            setMorphFromCatch(displayed.personalizedCatchCopy);
            setMorphing(true);
            setDisplayed(toResult);
          }}
          onComplete={() => {
            setPending(null);
            setMorphing(false);
            setMorphFrom(null);
            setMorphFromCatch(null);
          }}
        />
      ) : null}
    </main>
  );
}
