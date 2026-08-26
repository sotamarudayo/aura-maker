"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuraBackground from "@/components/AuraBackground";
import VoteWordPicker, { VOTE_PICKER_MAX } from "@/components/VoteWordPicker";
import { trackEvent } from "@/lib/analytics";
import { submitVotesViaApi } from "@/lib/votes/client";
import type { VoteWord } from "@/lib/constants/words";

type SelfVoteClientProps = {
  userId: string;
  displayName: string;
};

export default function SelfVoteClient({ userId, displayName }: SelfVoteClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<VoteWord[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleWord(word: VoteWord) {
    if (sending) return;
    setSelected((prev) => {
      if (prev.includes(word)) {
        return prev.filter((item) => item !== word);
      }
      if (prev.length >= VOTE_PICKER_MAX) {
        return prev;
      }
      return [...prev, word];
    });
  }

  async function submitSelfVote() {
    if (selected.length === 0) {
      setError("1つ以上選んでください。");
      return;
    }

    setSending(true);
    setError(null);

    const result = await submitVotesViaApi(userId, selected, { isSelfVote: true });
    if (!result.ok) {
      setError(result.error);
      setSending(false);
      return;
    }

    trackEvent("self_vote_submit", { word_count: selected.length });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 pb-28 text-white sm:py-10 sm:pb-32">
      <AuraBackground />
      <section className="relative z-10 mx-auto w-full min-w-0 max-w-4xl rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur sm:p-6 md:p-8">
        <div className="rounded-xl border border-fuchsia-300/25 bg-fuchsia-500/10 p-4">
          <p className="text-xs font-semibold tracking-wide text-fuchsia-100">STEP 1 / 自己診断</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            まずは{displayName}さん自身が「自分を3語」で表しましょう。
            これで暫定オーラが完成し、友達にシェアできるカードが用意できます。
          </p>
        </div>

        <h1 className="mt-5 break-words text-2xl font-black leading-tight sm:text-3xl">
          自分を3語で表すなら？
        </h1>
        <p className="mt-2 text-sm text-white/75 sm:text-base">
          友達の投票が増えるほど、「自分で思ってる自分」と「周りから見られてる自分」のズレが見えてきます。
        </p>

        <VoteWordPicker
          selected={selected}
          onToggle={toggleWord}
          disabled={sending}
          hint="自己診断用：最大3つ。あとから友達の票で上書き・更新されていきます。"
        />

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/15 bg-black/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            disabled={sending || selected.length === 0}
            onClick={submitSelfVote}
            className="rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black disabled:opacity-60 sm:px-6 sm:text-base"
          >
            {sending ? "保存中..." : `この3語で暫定オーラを完成 (${selected.length}/${VOTE_PICKER_MAX})`}
          </button>
          <p className="min-w-0 flex-1 break-words text-sm text-white/80">
            選択中: {selected.join(" / ") || "なし"}
          </p>
        </div>
      </div>
    </main>
  );
}
