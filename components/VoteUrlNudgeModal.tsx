"use client";

import { useLocale } from "@/components/LocaleProvider";

type VoteUrlNudgeModalProps = {
  open: boolean;
  onCopy: () => void;
  onDismiss: () => void;
};

export default function VoteUrlNudgeModal({ open, onCopy, onDismiss }: VoteUrlNudgeModalProps) {
  const { t } = useLocale();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-8 sm:items-center sm:pb-0">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-url-nudge-title"
        className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-5 text-white shadow-2xl sm:p-6"
      >
        <h2 id="vote-url-nudge-title" className="text-xl font-black leading-snug sm:text-2xl">
          {t.dashboard.voteNudgeTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{t.dashboard.voteNudgeSub}</p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={onCopy}
            className="min-h-12 rounded-2xl bg-cyan-400 px-5 py-3 text-base font-black text-black"
          >
            {t.dashboard.voteNudgeCopy}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-12 rounded-2xl border border-white/25 bg-white/5 px-5 py-3 text-base font-semibold text-white/85"
          >
            {t.dashboard.voteNudgeDismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
