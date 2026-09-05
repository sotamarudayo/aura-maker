"use client";

import { useLocale } from "@/components/LocaleProvider";
import { SECRET_UNLOCK_VOTES } from "@/lib/constants/auras";
import { trackEvent } from "@/lib/analytics";

type VotesProgressCardProps = {
  friendVoteCount: number;
  onCopyVoteUrl: () => void;
};

function nextGoal(friendVoteCount: number): {
  remaining: number;
  goal: number;
  kind: "provisional" | "stable" | "awaken" | "done";
} | null {
  if (friendVoteCount < 3) {
    return { remaining: 3 - friendVoteCount, goal: 3, kind: "provisional" };
  }
  if (friendVoteCount < 10) {
    return { remaining: 10 - friendVoteCount, goal: 10, kind: "stable" };
  }
  if (friendVoteCount < SECRET_UNLOCK_VOTES) {
    return {
      remaining: SECRET_UNLOCK_VOTES - friendVoteCount,
      goal: SECRET_UNLOCK_VOTES,
      kind: "awaken",
    };
  }
  return { remaining: 0, goal: SECRET_UNLOCK_VOTES, kind: "done" };
}

export default function VotesProgressCard({
  friendVoteCount,
  onCopyVoteUrl,
}: VotesProgressCardProps) {
  const { t } = useLocale();
  const goal = nextGoal(friendVoteCount);

  if (!goal || goal.kind === "done") {
    return (
      <section className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 sm:p-5">
        <p className="text-xs font-bold tracking-wide text-emerald-100/90">
          {t.dashboard.votesProgressEyebrow}
        </p>
        <h2 className="mt-1 text-lg font-black text-white">{t.dashboard.votesProgressDoneTitle}</h2>
        <p className="mt-2 text-sm text-white/70">
          {t.dashboard.votesProgressDoneBody.replace("{count}", String(friendVoteCount))}
        </p>
      </section>
    );
  }

  const title =
    goal.kind === "provisional"
      ? t.dashboard.votesProgressTitleProvisional
      : goal.kind === "stable"
        ? t.dashboard.votesProgressTitleStable
        : t.dashboard.votesProgressTitleAwaken;

  const body = t.dashboard.votesProgressBody
    .replace("{remaining}", String(goal.remaining))
    .replace("{goal}", String(goal.goal))
    .replace("{count}", String(friendVoteCount));

  const progress = Math.min(100, Math.round((friendVoteCount / goal.goal) * 100));

  return (
    <section className="rounded-2xl border border-cyan-300/35 bg-gradient-to-br from-cyan-500/15 via-black/35 to-violet-500/15 p-4 sm:p-5">
      <p className="text-xs font-bold tracking-wide text-cyan-100/90">
        {t.dashboard.votesProgressEyebrow}
      </p>
      <h2 className="mt-1 text-lg font-black text-white sm:text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/75">{body}</p>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-white/55">
          <span>
            {friendVoteCount}/{goal.goal}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          trackEvent("votes_progress_cta", {
            friend_votes: friendVoteCount,
            goal: goal.goal,
            kind: goal.kind,
          });
          onCopyVoteUrl();
        }}
        className="mt-4 w-full rounded-full bg-cyan-300 px-4 py-3 text-sm font-black text-black sm:text-base"
      >
        {t.dashboard.votesProgressCta}
      </button>
    </section>
  );
}
