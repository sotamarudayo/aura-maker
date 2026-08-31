"use client";

import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";
import { markVoteSent } from "@/lib/utils/vote-sent";

export type SubmitVotesResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

export async function submitVotesViaApi(
  targetUserId: string,
  words: string[],
  options?: { isSelfVote?: boolean; locale?: Locale },
): Promise<SubmitVotesResult> {
  const response = await fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      targetUserId,
      words,
      isSelfVote: options?.isSelfVote ?? false,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: string; code?: string }
    | null;

  if (!response.ok) {
    const locale = options?.locale ?? "ja";
    const t = getMessages(locale);
    return {
      ok: false,
      error: payload?.error ?? t.common.voteSubmitFailed,
      code: payload?.code,
    };
  }

  if (!options?.isSelfVote) {
    markVoteSent(targetUserId);
  }

  return { ok: true };
}

export async function checkVoteStatus(targetUserId: string): Promise<boolean> {
  const response = await fetch(
    `/api/votes?targetUserId=${encodeURIComponent(targetUserId)}`,
    { credentials: "include" },
  );
  if (!response.ok) return false;
  const payload = (await response.json()) as { alreadyVoted?: boolean };
  return payload.alreadyVoted === true;
}
