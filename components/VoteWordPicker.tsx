"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  VOTE_WORD_DEFS,
  getCategoryWordCount,
  getWordsByCategory,
  RECOMMENDED_WORD_LABELS,
  type VoteCategory,
  type VoteWord,
  type VoteWordDef,
} from "@/lib/constants/words";
import { getLocalizedWordLabel } from "@/lib/i18n/localize";

const MAX_SELECT = 3;

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
  const { locale, t } = useLocale();
  const isSelected = useMemo(() => new Set(selected), [selected]);

  const categorySections = useMemo(
    () =>
      [
        { id: "recommended", key: "all" as const, label: t.vote.categories.all },
        { id: "visual", key: "visual" as const, label: t.vote.categories.visual },
        { id: "vibes", key: "vibes" as const, label: t.vote.categories.vibes },
        { id: "chaos", key: "chaos" as const, label: t.vote.categories.chaos },
        { id: "gap", key: "gap" as const, label: t.vote.categories.gap },
        { id: "secret", key: "secret" as const, label: t.vote.categories.secret },
      ] satisfies Array<{ id: string; key: VoteCategory | "all"; label: string }>,
    [t],
  );

  const sections = useMemo(
    () =>
      categorySections.map((section) => {
        const words: VoteWordDef[] = getWordsByCategory(section.key);
        const count =
          section.key === "all"
            ? RECOMMENDED_WORD_LABELS.length
            : getCategoryWordCount(section.key);
        return { ...section, words, count };
      }),
    [categorySections],
  );

  const defaultHint = t.vote.pickHint
    .replace("{max}", String(MAX_SELECT))
    .replace("{total}", String(VOTE_WORD_DEFS.length));

  return (
    <>
      <p className="text-xs text-white/55">{hint ?? defaultHint}</p>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label={t.vote.categoryNav}>
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
              <span className="text-xs text-white/45">
                {section.count}
                {t.vote.wordCount}
              </span>
              {section.key === "all" ? (
                <span className="text-xs text-violet-200/80">🔥 {t.vote.recommended}</span>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {section.words.map((word) => {
                const selectedChip = isSelected.has(word.label);
                const displayLabel = getLocalizedWordLabel(word.label, locale);
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
                    {displayLabel}
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
