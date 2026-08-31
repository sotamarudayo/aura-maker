"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import AuraBackground from "@/components/AuraBackground";
import OpenInBrowserCta from "@/components/OpenInBrowserCta";
import { useLocale } from "@/components/LocaleProvider";
import VoteWordPicker, { VOTE_PICKER_MAX } from "@/components/VoteWordPicker";
import {
  buildVotePageHeading,
  buildVotePageSubcopy,
  buildVoteSubmitLabel,
  buildVoteThanksMessage,
  getVotePageFlow,
  getVotePageWhatIsThis,
} from "@/lib/constants/share";
import { getLocalizedWordLabel } from "@/lib/i18n/localize";
import { trackEvent } from "@/lib/analytics";
import { checkVoteStatus, submitVotesViaApi } from "@/lib/votes/client";
import { readVoteSent, subscribeVoteSent } from "@/lib/utils/vote-sent";
import { createClient } from "@/utils/supabase/client";
import type { VoteWord } from "@/lib/constants/words";

type VoteClientProps = {
  userId: string;
  displayName: string;
};

export default function VoteClient({ userId, displayName }: VoteClientProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [currentDisplayName, setCurrentDisplayName] = useState(() => displayName);
  const [selected, setSelected] = useState<VoteWord[]>([]);
  const localSent = useSyncExternalStore(
    subscribeVoteSent,
    () => readVoteSent(userId),
    () => false,
  );
  const [serverSent, setServerSent] = useState(false);
  const sent = localSent || serverSent;
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void checkVoteStatus(userId).then((alreadyVoted) => {
      if (!cancelled && alreadyVoted) {
        setServerSent(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

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
      if (prev.length >= VOTE_PICKER_MAX) {
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

    const result = await submitVotesViaApi(userId, selected);
    if (!result.ok) {
      if (result.code === "duplicate_vote") {
        setServerSent(true);
      }
      setError(result.error);
      setSending(false);
      return;
    }

    trackEvent("vote_submit", { word_count: selected.length });
    const wordsQuery = selected.map((word) => encodeURIComponent(word)).join(",");
    router.push(`/vote/${userId}/success?words=${wordsQuery}`);
  }

  if (sent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
        <AuraBackground />
        <section className="relative z-10 w-full min-w-0 max-w-xl rounded-2xl border border-white/20 bg-black/40 p-5 text-center backdrop-blur sm:p-8">
          <h1 className="text-2xl font-black leading-tight sm:text-3xl">投票済みです</h1>
          <p className="mt-3 text-white/80">
            {buildVoteThanksMessage(currentDisplayName, locale)}
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="block rounded-full bg-violet-300 px-4 py-3 text-center text-sm font-bold leading-snug text-black sm:px-5"
            >
              このままオーラ診断を始める
            </Link>
            <OpenInBrowserCta
              href="/"
              inAppOnly
              className="block rounded-full border border-white/30 bg-white/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-white sm:px-5"
              label="Safari / Chromeで開いて診断する"
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 pb-28 text-white sm:py-10 sm:pb-32">
      <AuraBackground />
      <section className="relative z-10 mx-auto w-full min-w-0 max-w-4xl rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur sm:p-6 md:p-8">
        <div className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 p-4">
          <p className="text-xs font-semibold tracking-wide text-cyan-100">これなに？</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            {getVotePageWhatIsThis(locale)}
          </p>
        </div>

        <h1 className="mt-5 break-words text-2xl font-black leading-tight sm:text-3xl">
          {buildVotePageHeading(currentDisplayName, locale)}
        </h1>
        <p className="mt-2 text-white/80">{buildVotePageSubcopy(currentDisplayName, locale)}</p>

        <div className="mt-4 rounded-xl border border-violet-300/25 bg-violet-500/10 p-4">
          <p className="text-xs font-semibold tracking-wide text-violet-100">投票するとどうなる？</p>
          <ol className="mt-2 space-y-1.5 text-sm text-white/75">
            {getVotePageFlow(locale).map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-bold text-violet-200">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <VoteWordPicker selected={selected} onToggle={toggleWord} disabled={sending} />

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
            {sending ? (locale === "en" ? "Sending..." : "送信中...") : buildVoteSubmitLabel(selected.length, locale)}
          </button>
          <p className="min-w-0 flex-1 break-words text-sm text-white/80">
            {locale === "en" ? "Selected: " : "選択中: "}
            {selected.map((word) => getLocalizedWordLabel(word, locale)).join(" / ") ||
              (locale === "en" ? "none" : "なし")}
          </p>
        </div>
      </div>
    </main>
  );
}
