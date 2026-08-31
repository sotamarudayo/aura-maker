"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OAuthButtons from "@/components/OAuthButtons";
import { useLocale } from "@/components/LocaleProvider";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "login" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      setError(decodeURIComponent(authError));
    }
  }, [searchParams]);

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signupError) {
        setError(signupError.message);
      } else {
        setMessage(t.login.signupSuccess);
      }
      setLoading(false);
      return;
    }

    const { error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signinError) {
      setError(signinError.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-black/40 p-6 text-left backdrop-blur">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-full px-4 py-2 text-sm ${
            mode === "login" ? "bg-white text-black" : "bg-white/10 text-white"
          }`}
        >
          {t.login.loginTab}
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-full px-4 py-2 text-sm ${
            mode === "signup" ? "bg-white text-black" : "bg-white/10 text-white"
          }`}
        >
          {t.login.signupTab}
        </button>
      </div>

      <OAuthButtons
        mode="signin"
        loading={loading}
        onLoadingChange={setLoading}
        onError={setError}
      />

      <div className="my-4 h-px bg-white/15" />

      <form onSubmit={handleEmailAuth} className="space-y-3">
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
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-white/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-400 px-4 py-2 font-semibold text-black disabled:opacity-60"
        >
          {loading
            ? t.common.processing
            : mode === "login"
              ? t.login.emailLogin
              : t.login.emailSignup}
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
