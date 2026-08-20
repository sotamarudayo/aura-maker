"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type LinkAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onLinked: () => void;
};

export default function LinkAccountModal({ open, onClose, onLinked }: LinkAccountModalProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleEmailLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: updateError } = await supabase.auth.updateUser({
      email,
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("連携しました。確認メールが届いた場合はリンクを開いてください。");
    onLinked();
    router.refresh();
    setLoading(false);
  }

  async function handleOAuthLink(provider: "google" | "twitter") {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: linkError } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (linkError) {
      setError(linkError.message);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">アカウントを連携して保存</h2>
            <p className="mt-1 text-sm text-white/70">
              ゲストデータを永久保存し、投票通知の受け取り準備ができます。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/25 px-2 py-1 text-sm text-white/80"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleEmailLink} className="space-y-3">
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-white/50"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="password（6文字以上）"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-300 px-4 py-2 font-semibold text-black disabled:opacity-70"
          >
            {loading ? "連携中..." : "メールで連携する"}
          </button>
        </form>

        <div className="my-4 h-px bg-white/15" />

        <div className="space-y-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLink("google")}
            className="w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2 disabled:opacity-70"
          >
            Googleで連携
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthLink("twitter")}
            className="w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2 disabled:opacity-70"
          >
            X（Twitter）で連携
          </button>
        </div>

        {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </div>
    </div>
  );
}
