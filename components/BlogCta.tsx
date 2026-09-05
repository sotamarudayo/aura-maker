"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import { useLocale } from "@/components/LocaleProvider";
import { createClient } from "@/utils/supabase/client";

export default function BlogCta() {
  const { t } = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <div className="rounded-2xl border border-violet-300/30 bg-gradient-to-br from-violet-500/15 via-transparent to-cyan-400/10 p-5 text-center sm:p-6">
      <p className="text-base font-bold text-white sm:text-lg">{t.blog.ctaTitle}</p>
      <div className="mt-4 flex justify-center">
        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="inline-flex rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.02]"
          >
            {t.blog.ctaLoggedIn}
          </Link>
        ) : (
          <AnonymousStartButton
            className="inline-flex rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
            label={t.blog.ctaGuest}
          />
        )}
      </div>
    </div>
  );
}
