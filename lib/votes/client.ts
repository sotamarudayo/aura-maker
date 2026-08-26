"use client";

import { markVoteSent } from "@/lib/utils/vote-sent";

export type SubmitVotesResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

export async function submitVotesViaApi(
  targetUserId: string,
  words: string[],
  options?: { isSelfVote?: boolean },
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
    return {
      ok: false,
      error: payload?.error ?? "投票の送信に失敗しました。",
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
