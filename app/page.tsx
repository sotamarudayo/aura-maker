import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import AuraEncyclopediaCard from "@/components/AuraEncyclopediaCard";
import { AURA_TYPES } from "@/lib/constants/auras";
import { SERVICE_SHARE_TEXT } from "@/lib/constants/share";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "AuraMaker | 友達から見た自分のオーラがわかる",
  description: SERVICE_SHARE_TEXT,
  openGraph: {
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description: SERVICE_SHARE_TEXT,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description: SERVICE_SHARE_TEXT,
  },
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <AuraBackground />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl space-y-12 sm:space-y-16">
        <section className="rounded-3xl border border-white/20 bg-black/35 p-5 backdrop-blur sm:p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-200 sm:text-sm">AuraMaker</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            匿名の印象を、動くオーラに。
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">
            友だちやフォロワーから「あなたらしさ」を匿名投票で集めて、ランキングと
            Word Cloud、SNSシェア画像に変換するエンタメサービスです。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <AnonymousStartButton className="w-full rounded-full bg-violet-300 px-6 py-3 text-center font-semibold text-black disabled:opacity-60 sm:w-auto" />
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-center font-semibold text-white sm:w-auto"
            >
              ログイン / 新規登録
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-white/70 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-3">匿名投票URLを発行</div>
            <div className="rounded-xl bg-white/10 p-3">リアルタイム集計</div>
            <div className="rounded-xl bg-white/10 p-3">X / LINE / Instagramで共有</div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.25em] text-violet-200">AURA ENCYCLOPEDIA</p>
            <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
              全{AURA_TYPES.length}種類のオーラを発見しよう
            </h2>
            <p className="mx-auto mt-3 max-w-2xl px-1 text-sm text-white/75 sm:text-base">
              16Personalitiesのように、あなたの印象ワードの組み合わせで決まるオーラタイプ。
              友だちに投票してもらい、あなただけの色を見つけましょう。
            </p>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {AURA_TYPES.map((aura) => (
              <AuraEncyclopediaCard key={aura.id} aura={aura} />
            ))}
          </div>

          <div className="flex justify-center px-1 pt-2">
            <AnonymousStartButton
              className="w-full max-w-md rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] hover:shadow-violet-300/30 disabled:opacity-60 sm:w-auto sm:px-8 sm:text-base"
              label="あなたのオーラは何色？ 友達に聞いてみる"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
