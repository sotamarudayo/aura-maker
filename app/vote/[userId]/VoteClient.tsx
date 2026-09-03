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
import {
  MAX_VOTER_DISPLAY_NAME_LENGTH,
  VOTE_RELATIONSHIPS,
  type VoteRelationship,
} from "@/lib/votes/relationship";
import { readVoteSent, subscribeVoteSent } from "@/lib/utils/vote-sent";
import { createClient } from "@/utils/supabase/client";
import type { VoteWord } from "@/lib/constants/words";

type VoteClientProps = {
  userId: string;
  displayName: string;
};

export default function VoteClient({ userId, displayName }: VoteClientProps) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [currentDisplayName, setCurrentDisplayName] = useState(() => displayName);
  const [selected, setSelected] = useState<VoteWord[]>([]);
  const [relationship, setRelationship] = useState<VoteRelationship | null>(null);
  const [nickname, setNickname] = useState("");
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
    if (!relationship) {
      setError(t.voteFlow.relationshipRequired);
      return;
    }
    if (selected.length === 0) {
      setError(t.common.pickAtLeastOne);
      return;
    }

    setSending(true);
    setError(null);

    const result = await submitVotesViaApi(userId, selected, {
      locale,
      relationship,
      voterDisplayName: nickname,
    });
    if (!result.ok) {
      if (result.code === "duplicate_vote") {
        setServerSent(true);
      }
      setError(result.error);
      setSending(false);
      return;
    }

    trackEvent("vote_submit", {
      word_count: selected.length,
      relationship,
      has_nickname: nickname.trim().length > 0,
    });
    const wordsQuery = selected.map((word) => encodeURIComponent(word)).join(",");
    router.push(`/vote/${userId}/success?words=${wordsQuery}`);
  }

  const canSubmit = Boolean(relationship) && selected.length > 0 && !sending;

  if (sent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
        <AuraBackground />
        <section className="relative z-10 w-full min-w-0 max-w-xl rounded-2xl border border-white/20 bg-black/40 p-5 text-center backdrop-blur sm:p-8">
          <h1 className="text-2xl font-black leading-tight sm:text-3xl">{t.voteFlow.alreadyVoted}</h1>
          <p className="mt-3 text-white/80">
            {buildVoteThanksMessage(currentDisplayName, locale)}
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="block rounded-full bg-violet-300 px-4 py-3 text-center text-sm font-bold leading-snug text-black sm:px-5"
            >
              {t.voteFlow.startOwnDiagnosis}
            </Link>
            <OpenInBrowserCta
              href="/"
              inAppOnly
              className="block rounded-full border border-white/30 bg-white/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-white sm:px-5"
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
          <p className="text-xs font-semibold tracking-wide text-cyan-100">{t.voteFlow.whatIsThis}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            {getVotePageWhatIsThis(locale)}
          </p>
        </div>

        <h1 className="mt-5 break-words text-2xl font-black leading-tight sm:text-3xl">
          {buildVotePageHeading(currentDisplayName, locale)}
        </h1>
        <p className="mt-2 text-white/80">{buildVotePageSubcopy(currentDisplayName, locale)}</p>

        <div className="mt-4 rounded-xl border border-violet-300/25 bg-violet-500/10 p-4">
          <p className="text-xs font-semibold tracking-wide text-violet-100">{t.voteFlow.whatHappens}</p>
          <ol className="mt-2 space-y-1.5 text-sm text-white/75">
            {getVotePageFlow(locale).map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-bold text-violet-200">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-bold text-white">{t.voteFlow.relationshipLabel}</p>
            <p className="text-xs text-white/50">{t.voteFlow.relationshipHint}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {VOTE_RELATIONSHIPS.map((id) => {
              const active = relationship === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={sending}
                  onClick={() => setRelationship(id)}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                    active
                      ? "bg-cyan-300 text-black"
                      : "border border-white/25 bg-white/10 text-white/85 hover:bg-white/15"
                  }`}
                >
                  {t.voteFlow.relationships[id]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <label htmlFor="voter-nickname" className="block text-sm font-bold text-white">
            {t.voteFlow.nicknameLabel}
          </label>
          <input
            id="voter-nickname"
            type="text"
            value={nickname}
            maxLength={MAX_VOTER_DISPLAY_NAME_LENGTH}
            disabled={sending}
            autoComplete="nickname"
            placeholder={t.voteFlow.nicknamePlaceholder}
            onChange={(event) => setNickname(event.target.value)}
            className="w-full rounded-xl border border-white/25 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none ring-cyan-300/40 focus:ring-2 disabled:opacity-60"
          />
          <p className="text-xs text-white/50">{t.voteFlow.nicknameHint}</p>
        </div>

        <VoteWordPicker selected={selected} onToggle={toggleWord} disabled={sending} />

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/15 bg-black/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submitVote}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-black disabled:opacity-60 sm:px-6 sm:text-base"
          >
            {sending ? t.common.sending : buildVoteSubmitLabel(selected.length, locale)}
          </button>
          <p className="min-w-0 flex-1 break-words text-sm text-white/80">
            {relationship ? (
              <span className="mr-2 inline-flex rounded-full border border-cyan-300/40 bg-cyan-500/15 px-2 py-0.5 text-xs font-bold text-cyan-100">
                {t.voteFlow.relationships[relationship]}
                {nickname.trim() ? ` · ${nickname.trim()}` : ""}
              </span>
            ) : null}
            {t.common.selected}
            {selected.map((word) => getLocalizedWordLabel(word, locale)).join(" / ") || t.common.none}
          </p>
        </div>
      </div>
    </main>
  );
}
