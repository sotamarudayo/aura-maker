"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import { useLocale } from "@/components/LocaleProvider";
import { createClient } from "@/utils/supabase/client";

type AuraDetailCtaProps = {
  accent: string;
};

export default function AuraDetailCta({ accent }: AuraDetailCtaProps) {
  const { t } = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <div
      className="rounded-2xl border p-5 text-center sm:p-6"
      style={{
        borderColor: `${accent}55`,
        background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 18%, transparent), rgba(0,0,0,0.35))`,
      }}
    >
      {isLoggedIn ? (
        <Link
          href="/dashboard"
          className="inline-flex w-full max-w-md items-center justify-center rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] sm:w-auto sm:text-base"
        >
          {t.encyclopedia.ctaLoggedIn}
        </Link>
      ) : (
        <AnonymousStartButton
          className="inline-flex w-full max-w-md items-center justify-center rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] disabled:opacity-60 sm:w-auto sm:text-base"
          label={t.encyclopedia.ctaGuest}
        />
      )}
    </div>
  );
}
