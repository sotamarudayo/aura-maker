import type { Metadata } from "next";
import Link from "next/link";
import AuraBackground from "@/components/AuraBackground";
import AuraEncyclopediaSection from "@/components/AuraEncyclopediaSection";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "オーラ図鑑",
  description: "AuraMakerの全オーラタイプ一覧。友達の印象ワードの組み合わせで決まる、あなただけのオーラを探そう。",
};

export default async function AurasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

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
              ← ダッシュボードへ戻る
            </Link>
          </div>
        ) : null}

        <AuraEncyclopediaSection showCta isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}
