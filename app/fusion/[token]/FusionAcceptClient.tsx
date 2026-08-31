"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuraBackground from "@/components/AuraBackground";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import { useLocale } from "@/components/LocaleProvider";
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
  const { t } = useLocale();
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
      setError(payload?.error ?? t.fusion.acceptFailed);
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
        <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{t.fusion.title}</h1>

        {status === "missing" ? (
          <p className="mt-4 text-sm text-white/75">{t.fusion.invalidLink}</p>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              {t.fusion.inviteBody
                .replace("{name}", inviterName)
                .replace("{aura}", inviterAuraName)}
            </p>

            {isOwnLink ? (
              <p className="mt-6 rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-100">
                {t.fusion.ownLink}
              </p>
            ) : null}

            {alreadyPartner || status === "accepted" ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-emerald-200">{t.fusion.alreadyFused}</p>
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-full bg-violet-300 px-5 py-3 text-sm font-bold text-black"
                >
                  {t.fusion.toDashboard}
                </Link>
              </div>
            ) : null}

            {!isOwnLink && status === "pending" && !alreadyPartner ? (
              <div className="mt-6 space-y-3">
                {!isLoggedIn ? (
                  <>
                    <p className="text-sm text-white/70">{t.fusion.needAccount}</p>
                    <Link
                      href={`/login?next=${encodeURIComponent(`/fusion/${token}`)}`}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black"
                    >
                      {t.fusion.loginStart}
                    </Link>
                    <AnonymousStartButton
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                    />
                  </>
                ) : needsSelfVote ? (
                  <>
                    <p className="text-sm text-white/70">{t.fusion.needSelfVote}</p>
                    <Link
                      href="/onboarding/self-vote"
                      className="inline-flex w-full items-center justify-center rounded-full bg-violet-300 px-5 py-3 text-sm font-bold text-black"
                    >
                      {t.fusion.toSelfVote}
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={acceptFusion}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black disabled:opacity-60"
                  >
                    {loading ? t.fusion.accepting : t.fusion.accept}
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
