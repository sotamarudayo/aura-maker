"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/utils/supabase/client";

type AnonymousStartButtonProps = {
  className?: string;
  label?: string;
  onStarted?: () => void;
  startSource?: string;
};

const NAME_MIN = 1;
const NAME_MAX = 20;

export default function AnonymousStartButton({
  className = "rounded-full bg-violet-300 px-6 py-3 font-semibold text-black disabled:opacity-60",
  label,
  onStarted,
  startSource = "default",
}: AnonymousStartButtonProps) {
  const router = useRouter();
  const { t } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [askingName, setAskingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonLabel = label ?? t.landing.startGuest;

  useEffect(() => {
    if (!askingName) return;
    inputRef.current?.focus();
  }, [askingName]);

  async function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = displayName.trim();
    if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
      setError(
        t.anonymousStart.nameError
          .replace("{min}", String(NAME_MIN))
          .replace("{max}", String(NAME_MAX)),
      );
      return;
    }

    setLoading(true);
    setError(null);

    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const userId = signInData.user?.id;
    if (!userId) {
      setError(t.anonymousStart.createUserError);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        display_name: trimmed,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    trackEvent("start_anonymous", { has_display_name: true, source: startSource });
    onStarted?.();
    router.push("/onboarding/self-vote");
    router.refresh();
  }

  if (!askingName) {
    return (
      <div className="w-full min-w-0 space-y-2">
        <button
          type="button"
          onClick={() => {
            trackEvent("start_anonymous_click", { source: startSource });
            setError(null);
            setAskingName(true);
          }}
          className={`w-full sm:w-auto ${className}`}
        >
          {buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-2">
      <form
        onSubmit={handleStart}
        className="w-full max-w-md space-y-3 rounded-2xl border border-white/25 bg-black/45 p-4 backdrop-blur sm:p-5"
      >
        <div>
          <p className="text-sm font-semibold text-violet-100">{t.anonymousStart.nameTitle}</p>
          <p className="mt-1 text-xs text-white/65">{t.anonymousStart.nameSub}</p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm text-white/80">
            {t.anonymousStart.nameLabel
              .replace("{min}", String(NAME_MIN))
              .replace("{max}", String(NAME_MAX))}
          </span>
          <input
            ref={inputRef}
            value={displayName}
            maxLength={NAME_MAX}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder={t.anonymousStart.namePlaceholder}
            disabled={loading}
            className="w-full rounded-xl border border-white/25 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none ring-violet-300/40 focus:ring-2"
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-violet-300 px-5 py-2.5 text-sm font-bold text-black disabled:opacity-60 sm:flex-1"
          >
            {loading ? t.anonymousStart.submitting : t.anonymousStart.submit}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setAskingName(false);
              setError(null);
            }}
            className="w-full rounded-full border border-white/30 px-5 py-2.5 text-sm text-white/85 disabled:opacity-60 sm:w-auto"
          >
            {t.anonymousStart.back}
          </button>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </form>
    </div>
  );
}
