"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuraBackground from "@/components/AuraBackground";
import { trackEvent } from "@/lib/analytics";

type FusionAcceptClientProps = {
  token: string;
  inviterName: string;
  inviterAuraName: string;
  status: "pending" | "accepted" | "missing";
  isLoggedIn: boolean;
  needsSelfVote: boolean;
  isOwnLink: boolean;
  alreadyPartner: boolean;
};

export default function FusionAcceptClient({
  token,
  inviterName,
  inviterAuraName,
  status,
  isLoggedIn,
  needsSelfVote,
  isOwnLink,
  alreadyPartner,
}: FusionAcceptClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function acceptFusion() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/fusion/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; code?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error ?? "融合に失敗しました。");
      setLoading(false);
      return;
    }

    trackEvent("aura_fusion_accept");
    router.push("/dashboard?fusion=1");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-10 text-white">
      <AuraBackground />
      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-white/20 bg-black/45 p-6 text-center backdrop-blur sm:p-8">
        <p className="text-xs font-bold tracking-[0.22em] text-fuchsia-200">AURA FUSION</p>
        <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">友達とオーラ融合</h1>

        {status === "missing" ? (
          <p className="mt-4 text-sm text-white/75">この融合リンクは無効か、期限切れです。</p>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              <span className="font-bold text-white">{inviterName}</span>
              （{inviterAuraName}）からオーラ融合のお願いが届いています。
              お互いの本物のオーラが揃うと、融合カードが作れます。
            </p>

            {isOwnLink ? (
              <p className="mt-6 rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-100">
                これはあなたの融合リンクです。友達に送ってね。
              </p>
            ) : null}

            {alreadyPartner || status === "accepted" ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-emerald-200">融合済みです。ダッシュボードでカードを確認できます。</p>
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-full bg-violet-300 px-5 py-3 text-sm font-bold text-black"
                >
                  ダッシュボードへ
                </Link>
              </div>
            ) : null}

            {!isOwnLink && status === "pending" && !alreadyPartner ? (
              <div className="mt-6 space-y-3">
                {!isLoggedIn ? (
                  <>
                    <p className="text-sm text-white/70">融合するにはアカウント作成（またはログイン）が必要です。</p>
                    <Link
                      href={`/login?next=${encodeURIComponent(`/fusion/${token}`)}`}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black"
                    >
                      ログイン / はじめる
                    </Link>
                    <Link
                      href={`/?fusion=${encodeURIComponent(token)}`}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                    >
                      登録なしですぐ始める
                    </Link>
                  </>
                ) : needsSelfVote ? (
                  <>
                    <p className="text-sm text-white/70">先に自己診断（3語）を完了してください。</p>
                    <Link
                      href="/onboarding/self-vote"
                      className="inline-flex w-full items-center justify-center rounded-full bg-violet-300 px-5 py-3 text-sm font-bold text-black"
                    >
                      自己診断へ
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={acceptFusion}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black disabled:opacity-60"
                  >
                    {loading ? "融合中..." : "✨ オーラを融合する"}
                  </button>
                )}
              </div>
            ) : null}
          </>
        )}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </section>
    </main>
  );
}
