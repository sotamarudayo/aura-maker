"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import AuraBackground from "@/components/AuraBackground";
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
import {
  buildServiceShareUrls,
  buildVotePageHeading,
  buildVotePageSubcopy,
  buildVoteSubmitLabel,
  buildVoteThanksMessage,
  SERVICE_SHARE_TEXT,
  VOTE_PAGE_FLOW,
} from "@/lib/constants/share";
import { trackEvent } from "@/lib/analytics";
import { markVoteSent, readVoteSent, subscribeVoteSent } from "@/lib/utils/vote-sent";
import { createClient } from "@/utils/supabase/client";

type VoteClientProps = {
  userId: string;
  displayName: string;
  siteUrl: string;
};

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

export default function VoteClient({ userId, displayName, siteUrl }: VoteClientProps) {
  const supabase = useMemo(() => createClient(), []);
  const [currentDisplayName, setCurrentDisplayName] = useState(() => displayName);
  const [selected, setSelected] = useState<VoteWord[]>([]);
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
          <h1 className="text-2xl font-black leading-tight sm:text-3xl">投票ありがとう！</h1>
          <p className="mt-3 text-white/80">{buildVoteThanksMessage(currentDisplayName)}</p>

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
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 pb-28 text-white sm:py-10 sm:pb-32">
      <AuraBackground />
      <section className="relative z-10 mx-auto w-full min-w-0 max-w-4xl rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur sm:p-6 md:p-8">
        <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl">
          {buildVotePageHeading(currentDisplayName)}
        </h1>
        <p className="mt-2 text-white/80">{buildVotePageSubcopy(currentDisplayName)}</p>

        <div className="mt-4 rounded-xl border border-violet-300/25 bg-violet-500/10 p-4">
          <p className="text-xs font-semibold tracking-wide text-violet-100">投票するとどうなる？</p>
          <ol className="mt-2 space-y-1.5 text-sm text-white/75">
            {VOTE_PAGE_FLOW.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-bold text-violet-200">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-3 text-xs text-white/55">
          正直でもネタ多めでもOK。全{VOTE_WORD_DEFS.length}語から最大3つまで選べます。カテゴリごとに全部並んでるので、スクロールして探してね。
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
                      onClick={() => toggleWord(word.label)}
                      className={`vote-chip rounded-full px-3 py-2 text-sm font-semibold transition duration-200 ${
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

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/15 bg-black/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            disabled={sending || selected.length === 0}
            onClick={submitVote}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-black disabled:opacity-60 sm:px-6 sm:text-base"
          >
            {sending ? "送信中..." : buildVoteSubmitLabel(selected.length)}
          </button>
          <p className="min-w-0 flex-1 break-words text-sm text-white/80">
            選択中: {selected.join(" / ") || "なし"}
          </p>
        </div>
      </div>
    </main>
  );
}
