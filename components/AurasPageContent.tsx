"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuraBackground from "@/components/AuraBackground";
import AuraEncyclopediaSection from "@/components/AuraEncyclopediaSection";
import { useLocale } from "@/components/LocaleProvider";
import { createClient } from "@/utils/supabase/client";

export default function AurasPageContent() {
  const { t } = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <AuraBackground />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl space-y-8">
        {isLoggedIn ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {t.encyclopedia.backDashboard}
            </Link>
          </div>
        ) : null}

        <AuraEncyclopediaSection showCta isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}
