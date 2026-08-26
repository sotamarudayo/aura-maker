"use client";

import { useMemo } from "react";
import { calculateAuraType } from "@/lib/constants/auras";

type SelfFriendGapCardProps = {
  displayName: string;
  userId: string;
  selfWords: string[];
  friendWords: string[];
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

export default function SelfFriendGapCard({
  displayName,
  userId,
  selfWords,
  friendWords,
}: SelfFriendGapCardProps) {
  const selfAura = useMemo(
    () => calculateAuraType(selfWords, { userId, displayName }),
    [selfWords, userId, displayName],
  );
  const friendAura = useMemo(
    () => calculateAuraType(friendWords, { userId, displayName }),
    [friendWords, userId, displayName],
  );

  const selfTags = topTags(selfWords);
  const friendTags = topTags(friendWords);
  const overlap = selfTags.filter((word) => friendTags.includes(word));
  const onlySelf = selfTags.filter((word) => !friendTags.includes(word));
  const onlyFriend = friendTags.filter((word) => !selfTags.includes(word));

  return (
    <section className="min-w-0 rounded-2xl border border-amber-300/35 bg-gradient-to-br from-amber-500/10 via-black/20 to-fuchsia-500/10 p-4 backdrop-blur sm:p-6">
      <p className="text-[11px] font-bold tracking-[0.22em] text-amber-100/80">GAP ANALYSIS</p>
      <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">自分 vs 友達のズレ</h2>
      <p className="mt-2 text-sm text-white/70">
        自己診断と友達投票が揃うと、認識のギャップが見えてきます。
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-4">
          <p className="text-xs font-semibold text-fuchsia-100">🪞 自分で思ってる自分</p>
          <p className="mt-2 text-lg font-black text-white">{selfAura.aura.archetypeName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selfTags.map((word) => (
              <span
                key={`self-${word}`}
                className="rounded-full border border-fuchsia-200/30 bg-black/20 px-2.5 py-1 text-xs font-bold"
              >
                #{word}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-4">
          <p className="text-xs font-semibold text-cyan-100">👀 周りから見られてる自分</p>
          <p className="mt-2 text-lg font-black text-white">{friendAura.aura.archetypeName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {friendTags.map((word) => (
              <span
                key={`friend-${word}`}
                className="rounded-full border border-cyan-200/30 bg-black/20 px-2.5 py-1 text-xs font-bold"
              >
                #{word}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-4 rounded-xl border border-white/15 bg-black/25 p-4 text-sm leading-relaxed text-white/80">
        {overlap.length > 0 ? (
          <p>
            <span className="font-semibold text-emerald-200">一致:</span>{" "}
            {overlap.map((word) => `「${word}」`).join("、")}
            は自分認識と友達目線が一致しています。
          </p>
        ) : null}
        {onlySelf.length > 0 ? (
          <p className={overlap.length > 0 ? "mt-2" : undefined}>
            <span className="font-semibold text-fuchsia-200">自分だけ:</span>{" "}
            {onlySelf.map((word) => `「${word}」`).join("、")}
            は自分ではそう思ってるけど、友達票ではまだ弱いかも。
          </p>
        ) : null}
        {onlyFriend.length > 0 ? (
          <p className="mt-2">
            <span className="font-semibold text-cyan-200">友達だけ:</span>{" "}
            {onlyFriend.map((word) => `「${word}」`).join("、")}
            は周りだけが見えてる一面の可能性大。
          </p>
        ) : null}
        {selfAura.aura.id !== friendAura.aura.id ? (
          <p className="mt-2 font-semibold text-amber-100">
            通り名も「{selfAura.aura.archetypeName}」→「{friendAura.aura.archetypeName}」に更新されました。
          </p>
        ) : null}
      </div>
    </section>
  );
}
