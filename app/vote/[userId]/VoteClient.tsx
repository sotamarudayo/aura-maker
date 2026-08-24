"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import AuraBackground from "@/components/AuraBackground";
import {
  VOTE_CATEGORY_LABELS,
  VOTE_WORD_DEFS,
  getCategoryWordCount,
  getWordsByCategory,
  type VoteCategory,
  type VoteWord,
} from "@/lib/constants/words";
import { buildServiceShareUrls, SERVICE_SHARE_TEXT } from "@/lib/constants/share";
import { trackEvent } from "@/lib/analytics";
import { markVoteSent, readVoteSent, subscribeVoteSent } from "@/lib/utils/vote-sent";
import { createClient } from "@/utils/supabase/client";

type VoteClientProps = {
  userId: string;
  displayName: string;
  siteUrl: string;
};

const MAX_SELECT = 3;
const FILTER_TABS: Array<VoteCategory | "all"> = [
  "all",
  "visual",
  "vibes",
  "chaos",
  "gap",
  "secret",
];

export default function VoteClient({ userId, displayName, siteUrl }: VoteClientProps) {
  const supabase = useMemo(() => createClient(), []);
  const [currentDisplayName, setCurrentDisplayName] = useState(() => displayName);
  const [selected, setSelected] = useState<VoteWord[]>([]);
  const [category, setCategory] = useState<VoteCategory | "all">("all");
  const sent = useSyncExternalStore(
    subscribeVoteSent,
    () => readVoteSent(userId),
    () => false,
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const serviceShareUrls = useMemo(() => buildServiceShareUrls(siteUrl), [siteUrl]);

  const isSelected = useMemo(() => new Set(selected), [selected]);
  const visibleWords = useMemo(() => getWordsByCategory(category), [category]);

  useEffect(() => {
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const nextName = payload.new.display_name;
          if (typeof nextName === "string" && nextName.trim().length > 0) {
            setCurrentDisplayName(nextName);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  function toggleWord(word: VoteWord) {
    if (sent || sending) return;
    setSelected((prev) => {
      if (prev.includes(word)) {
        return prev.filter((item) => item !== word);
      }
      if (prev.length >= MAX_SELECT) {
        return prev;
      }
      return [...prev, word];
    });
  }

  async function submitVote() {
    if (selected.length === 0) {
      setError("1つ以上選んでください。");
      return;
    }

    setSending(true);
    setError(null);

    const rows = selected.map((word) => ({
      target_user_id: userId,
      word,
    }));

    const { error: insertError } = await supabase.from("votes").insert(rows);

    if (insertError) {
      setError(insertError.message);
      setSending(false);
      return;
    }

    markVoteSent(userId);
    trackEvent("vote_submit", { word_count: selected.length });
    setSending(false);
  }

  async function copyServiceUrl() {
    await navigator.clipboard.writeText(siteUrl);
    trackEvent("copy_service_url", { source: "vote_thanks" });
    setCopyMessage("サイトのURLをコピーしました！");
    window.setTimeout(() => setCopyMessage(null), 1800);
  }

  if (sent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
        <AuraBackground />
        <section className="relative z-10 w-full min-w-0 max-w-xl rounded-2xl border border-white/20 bg-black/40 p-5 text-center backdrop-blur sm:p-8">
          <h1 className="text-2xl font-black leading-tight sm:text-3xl">投票ありがとうございます！</h1>
          <p className="mt-3 text-white/80">
            {currentDisplayName}さんへの印象ワードを送信しました。
          </p>

          <div className="mt-8 space-y-3 text-left">
            <Link
              href="/"
              className="block rounded-full bg-violet-300 px-4 py-3 text-center text-sm font-bold leading-snug text-black sm:px-5"
            >
              あなたも自分のオーラを診断してみる？（1タップで作成）
            </Link>

            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm font-semibold text-violet-100">友達にこのサイトを教える</p>
              <p className="mt-1 text-xs text-white/65">{SERVICE_SHARE_TEXT}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyServiceUrl}
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                >
                  URLをコピー
                </button>
                {serviceShareUrls ? (
                  <>
                    <a
                      href={serviceShareUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                    >
                      Xでシェア
                    </a>
                    <a
                      href={serviceShareUrls.line}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                    >
                      LINEでシェア
                    </a>
                  </>
                ) : null}
              </div>
              {copyMessage ? (
                <p className="mt-2 text-xs text-emerald-300">{copyMessage}</p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-10">
      <AuraBackground />
      <section className="relative z-10 mx-auto w-full min-w-0 max-w-4xl rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur sm:p-6 md:p-8">
        <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl">
          {currentDisplayName} さんを表すワードを選ぼう
        </h1>
        <p className="mt-2 text-white/80">
          最大3つまで選択できます。全{VOTE_WORD_DEFS.length}語から印象をピック。
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const active = category === tab;
            const countLabel =
              tab === "all"
                ? "おすすめ12"
                : `${getCategoryWordCount(tab)}語`;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setCategory(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                  active
                    ? "bg-white text-black shadow-[0_0_18px_rgba(196,181,253,0.45)]"
                    : "bg-white/10 text-white/85 hover:bg-white/20"
                }`}
              >
                {VOTE_CATEGORY_LABELS[tab]}
                <span className="ml-1 text-[10px] opacity-70">({countLabel})</span>
              </button>
            );
          })}
        </div>

        {category === "all" ? (
          <p className="mt-3 text-xs text-violet-200/90">
            🔥 よく選ばれる12語。もっと探すなら上のカテゴリタブをタップ（全{VOTE_WORD_DEFS.length}語）
          </p>
        ) : (
          <p className="mt-3 text-xs text-white/55">
            {VOTE_CATEGORY_LABELS[category]}カテゴリから選べます
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {visibleWords.map((word) => {
            const selectedChip = isSelected.has(word.label);
            return (
              <button
                key={word.id}
                type="button"
                onClick={() => toggleWord(word.label)}
                className={`vote-chip rounded-full px-3 py-2 text-sm font-semibold transition duration-200 ${
                  selectedChip
                    ? "vote-chip-selected bg-violet-300 text-black"
                    : "bg-white/10 text-white hover:bg-white/20 hover:scale-[1.03]"
                }`}
              >
                {word.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            disabled={sending || selected.length === 0}
            onClick={submitVote}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-black disabled:opacity-60 sm:px-6 sm:text-base"
          >
            {sending ? "送信中..." : `投票する（${selected.length}/3）`}
          </button>
          <p className="min-w-0 break-words text-sm text-white/80">
            選択中: {selected.join(" / ") || "なし"}
          </p>
        </div>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </section>
    </main>
  );
}
