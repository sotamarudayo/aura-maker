"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { calculateAuraType } from "@/lib/constants/auras";
import { getLocalizedWordLabel, localizeAuraResult } from "@/lib/i18n/localize";
import type { RelationshipFaceGroup } from "@/lib/votes/relationship-faces";
import type { VoteRelationship } from "@/lib/votes/relationship";

type RelationshipFacesCardProps = {
  displayName: string;
  userId: string;
  faces: RelationshipFaceGroup[];
};

const FACE_TONE: Record<
  VoteRelationship,
  { border: string; bg: string; label: string; chip: string }
> = {
  close_friend: {
    border: "border-cyan-300/35",
    bg: "bg-cyan-500/10",
    label: "text-cyan-100",
    chip: "border-cyan-200/30",
  },
  partner: {
    border: "border-rose-300/35",
    bg: "bg-rose-500/10",
    label: "text-rose-100",
    chip: "border-rose-200/30",
  },
  coworker: {
    border: "border-amber-300/35",
    bg: "bg-amber-500/10",
    label: "text-amber-100",
    chip: "border-amber-200/30",
  },
  family: {
    border: "border-emerald-300/35",
    bg: "bg-emerald-500/10",
    label: "text-emerald-100",
    chip: "border-emerald-200/30",
  },
  other: {
    border: "border-violet-300/35",
    bg: "bg-violet-500/10",
    label: "text-violet-100",
    chip: "border-violet-200/30",
  },
};

function topTags(words: string[], limit = 3) {
  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .slice(0, limit)
    .map(([word]) => word);
}

export default function RelationshipFacesCard({
  displayName,
  userId,
  faces,
}: RelationshipFacesCardProps) {
  const { locale, t } = useLocale();

  const tiles = useMemo(
    () =>
      faces.map((face) => {
        const result = localizeAuraResult(
          calculateAuraType(face.words, { userId, displayName }),
          locale,
        );
        return {
          relationship: face.relationship,
          tags: topTags(face.words),
          archetypeName: result.aura.archetypeName,
          wordCount: face.words.length,
          tone: FACE_TONE[face.relationship],
        };
      }),
    [faces, userId, displayName, locale],
  );

  if (tiles.length === 0) return null;

  const title =
    tiles.length >= 2
      ? t.faces.titleMany.replace("{count}", String(tiles.length))
      : t.faces.titleOne;

  return (
    <section className="min-w-0 rounded-2xl border border-sky-300/30 bg-gradient-to-br from-sky-500/10 via-black/20 to-violet-500/10 p-4 backdrop-blur sm:p-6">
      <p className="text-[11px] font-bold tracking-[0.22em] text-sky-100/80">RELATIONSHIP FACES</p>
      <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{t.faces.sub}</p>

      <div
        className={`mt-5 grid gap-4 ${tiles.length === 1 ? "sm:grid-cols-1" : tiles.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
      >
        {tiles.map((tile) => (
          <article
            key={tile.relationship}
            className={`rounded-2xl border ${tile.tone.border} ${tile.tone.bg} p-4`}
          >
            <p className={`text-xs font-semibold ${tile.tone.label}`}>
              {t.faces.fromView.replace(
                "{relationship}",
                t.voteFlow.relationships[tile.relationship],
              )}
            </p>
            <p className="mt-2 text-lg font-black text-white">{tile.archetypeName}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tile.tags.map((word) => (
                <span
                  key={`${tile.relationship}-${word}`}
                  className={`rounded-full border ${tile.tone.chip} bg-black/20 px-2.5 py-1 text-xs font-bold`}
                >
                  #{getLocalizedWordLabel(word, locale)}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/45">
              {t.faces.wordCount.replace("{count}", String(tile.wordCount))}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
