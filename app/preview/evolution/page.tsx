"use client";

import { useMemo, useState } from "react";
import AuraCard from "@/components/AuraCard";
import type { EvolutionStyle } from "@/components/AuraSphere";
import {
  generateDynamicDescription,
  getAuraById,
  type AuraCalculationResult,
  type AuraType,
} from "@/lib/constants/auras";

const FROM = getAuraById("healing-mint")!;
const TO = getAuraById("chaos-neon")!;

const STYLES: { id: EvolutionStyle; label: string; blurb: string }[] = [
  {
    id: "core-pulse",
    label: "真の輝き",
    blurb: "輪っかが中心へ集まって広がり、そのまま自然にゆらぎ始める",
  },
  {
    id: "crossfade",
    label: "じわっと色移り",
    blurb: "光も本体も重ねてゆっくり入れ替え",
  },
  {
    id: "collapse",
    label: "収縮→展開",
    blurb: "いったんしぼんでから新しい色で開く",
  },
  {
    id: "ring-burst",
    label: "リング広がり",
    blurb: "追加の輪だけ外へ広がる（本体の輪は固定）",
  },
];

const MORPH_MS = 3000;

function mockResult(aura: typeof FROM, words: string[]): AuraCalculationResult {
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
 * 進化演出の比較用。
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
  const [style, setStyle] = useState<EvolutionStyle>("core-pulse");
  const [displayed, setDisplayed] = useState(fromResult);
  const [morphing, setMorphing] = useState(false);
  const [morphFrom, setMorphFrom] = useState<AuraType | null>(null);
  const [morphFromCatch, setMorphFromCatch] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const visible = displayed;
  const isAwakened = visible.dynamicProfile.awakening.unlocked;
  const selected = STYLES.find((item) => item.id === style) ?? STYLES[0];

  function reset() {
    setDisplayed(fromResult);
    setMorphing(false);
    setMorphFrom(null);
    setMorphFromCatch(null);
    setPlaying(false);
  }

  function play() {
    if (playing) return;
    setPlaying(true);
    setDisplayed(fromResult);
    setMorphing(false);
    setMorphFrom(null);
    setMorphFromCatch(null);

    window.setTimeout(() => {
      setMorphFrom(fromResult.aura);
      setMorphFromCatch(fromResult.personalizedCatchCopy);
      setMorphing(true);
      setDisplayed(toResult);
    }, 40);

    window.setTimeout(() => {
      setMorphing(false);
      setMorphFrom(null);
      setMorphFromCatch(null);
      setPlaying(false);
    }, MORPH_MS + 80);
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="text-center">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">Preview</p>
          <h1 className="mt-2 text-2xl font-black">オーラ進化演出くらべ</h1>
          <p className="mt-2 text-sm text-white/60">
            {FROM.archetypeName} → {TO.archetypeName}
          </p>
          <p className="mt-1 text-sm text-violet-200/90">{selected.blurb}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {STYLES.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={playing}
              onClick={() => {
                reset();
                setStyle(item.id);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                style === item.id
                  ? "bg-violet-300 text-black"
                  : "border border-white/25 bg-white/10 text-white/85 hover:bg-white/15"
              } disabled:opacity-60`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={play}
            disabled={playing}
            className="rounded-full bg-cyan-300 px-6 py-2.5 text-sm font-black text-black disabled:opacity-60"
          >
            {playing ? "再生中..." : "この演出を再生"}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={playing}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            リセット
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
          evolutionMorphing={morphing}
          evolutionStyle={style}
          morphFromAura={morphFrom}
          morphFromCatchCopy={morphFromCatch}
        />
      </div>
    </main>
  );
}
