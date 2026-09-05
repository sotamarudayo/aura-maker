"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedWordLabel } from "@/lib/i18n/localize";

type VoteLike = {
  word: string;
  isSelfVote: boolean;
  createdAt: string | null;
};

type AuraMonthLogCardProps = {
  votes: VoteLike[];
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string, locale: string) {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  if (locale === "en") {
    return new Date(y, m - 1, 1).toLocaleString("en", { month: "long", year: "numeric" });
  }
  return `${y}年${m}月`;
}

export default function AuraMonthLogCard({ votes }: AuraMonthLogCardProps) {
  const { locale, t } = useLocale();

  const summary = useMemo(() => {
    const now = new Date();
    const thisKey = monthKey(now);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = monthKey(prev);

    const friendVotes = votes.filter((vote) => !vote.isSelfVote && vote.createdAt);
    const thisMonth = friendVotes.filter((vote) => monthKey(new Date(vote.createdAt!)) === thisKey);
    const lastMonth = friendVotes.filter((vote) => monthKey(new Date(vote.createdAt!)) === prevKey);

    const counts = new Map<string, number>();
    for (const vote of thisMonth) {
      counts.set(vote.word, (counts.get(vote.word) ?? 0) + 1);
    }
    const topWords = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => getLocalizedWordLabel(word, locale));

    const delta = thisMonth.length - lastMonth.length;

    return {
      thisKey,
      thisCount: thisMonth.length,
      lastCount: lastMonth.length,
      delta,
      topWords,
    };
  }, [votes, locale]);

  return (
    <section className="rounded-2xl border border-amber-200/25 bg-gradient-to-br from-amber-500/10 via-black/30 to-violet-500/10 p-4 backdrop-blur sm:p-5">
      <p className="text-xs font-bold tracking-wide text-amber-100/90">{t.dashboard.monthLogEyebrow}</p>
      <h2 className="mt-1 text-lg font-black text-white sm:text-xl">{t.dashboard.monthLogTitle}</h2>
      <p className="mt-1 text-sm text-white/65">
        {monthLabel(summary.thisKey, locale)} · {t.dashboard.monthLogVotes.replace("{count}", String(summary.thisCount))}
      </p>

      {summary.topWords.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold text-white/45">{t.dashboard.monthLogFace}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {summary.topWords.map((word) => (
              <li
                key={word}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/60">{t.dashboard.monthLogEmpty}</p>
      )}

      <p className="mt-4 text-sm text-white/70">
        {summary.delta > 0
          ? t.dashboard.monthLogUp.replace("{count}", String(summary.delta))
          : summary.delta < 0
            ? t.dashboard.monthLogDown.replace("{count}", String(Math.abs(summary.delta)))
            : t.dashboard.monthLogFlat}
      </p>
    </section>
  );
}
