"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type AnonymousStartButtonProps = {
  className?: string;
  label?: string;
};

export default function AnonymousStartButton({
  className = "rounded-full bg-violet-300 px-6 py-3 font-semibold text-black disabled:opacity-60",
  label = "登録なしですぐ始める（1タップ）",
}: AnonymousStartButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full min-w-0 space-y-2">
      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className={`w-full sm:w-auto ${className}`}
      >
        {loading ? "準備中..." : label}
      </button>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
