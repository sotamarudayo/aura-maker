"use client";

import { useMemo, useState } from "react";
import {
  VOTE_CATEGORY_LABELS,
  VOTE_WORD_DEFS,
  getCategoryWordCount,
  getWordsByCategory,
  RECOMMENDED_WORD_LABELS,
  type VoteCategory,
  type VoteWord,
  type VoteWordDef,
} from "@/lib/constants/words";

const MAX_SELECT = 3;

const CATEGORY_SECTIONS: Array<{
  id: string;
  key: VoteCategory | "all";
  label: string;
}> = [
  { id: "recommended", key: "all", label: VOTE_CATEGORY_LABELS.all },
  { id: "visual", key: "visual", label: VOTE_CATEGORY_LABELS.visual },
  { id: "vibes", key: "vibes", label: VOTE_CATEGORY_LABELS.vibes },
  { id: "chaos", key: "chaos", label: VOTE_CATEGORY_LABELS.chaos },
  { id: "gap", key: "gap", label: VOTE_CATEGORY_LABELS.gap },
  { id: "secret", key: "secret", label: VOTE_CATEGORY_LABELS.secret },
];

type VoteWordPickerProps = {
  selected: VoteWord[];
  onToggle: (word: VoteWord) => void;
  disabled?: boolean;
  hint?: string;
};

export default function VoteWordPicker({
  selected,
  onToggle,
  disabled = false,
  hint,
}: VoteWordPickerProps) {
  const isSelected = useMemo(() => new Set(selected), [selected]);

  const sections = useMemo(
    () =>
      CATEGORY_SECTIONS.map((section) => {
        const words: VoteWordDef[] = getWordsByCategory(section.key);
        const count =
          section.key === "all"
            ? RECOMMENDED_WORD_LABELS.length
            : getCategoryWordCount(section.key);
        return { ...section, words, count };
      }),
    [],
  );

  return (
    <>
      <p className="text-xs text-white/55">
        {hint ??
          `最大${MAX_SELECT}つまで。全${VOTE_WORD_DEFS.length}語から選べます。`}
      </p>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="カテゴリへジャンプ">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#vote-${section.id}`}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/20"
          >
            {section.label}
            <span className="ml-1 text-[10px] opacity-60">({section.count})</span>
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.id} id={`vote-${section.id}`} className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-baseline gap-2 border-b border-white/10 pb-2">
              <h2 className="text-base font-bold text-violet-100 sm:text-lg">{section.label}</h2>
              <span className="text-xs text-white/45">{section.count}語</span>
              {section.key === "all" ? (
                <span className="text-xs text-violet-200/80">🔥 よく選ばれる語</span>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {section.words.map((word) => {
                const selectedChip = isSelected.has(word.label);
                return (
                  <button
                    key={`${section.id}-${word.id}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onToggle(word.label)}
                    className={`vote-chip rounded-full px-3 py-2 text-sm font-semibold transition duration-200 disabled:opacity-60 ${
                      selectedChip
                        ? "vote-chip-selected bg-violet-300 text-black"
                        : "bg-white/10 text-white hover:scale-[1.03] hover:bg-white/20"
                    }`}
                  >
                    {word.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export { MAX_SELECT as VOTE_PICKER_MAX };
