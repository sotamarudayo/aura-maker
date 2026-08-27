import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import { AURA_TYPES } from "@/lib/constants/auras";
import { SERVICE_SHARE_TEXT } from "@/lib/constants/share";
import { createClient } from "@/utils/supabase/server";

/** トップで見せる投票キーワード例（実際の投票ワードから抜粋） */
const LANDING_EXAMPLE_WORDS = [
  { label: "カリスマ", selected: true },
  { label: "癒やし枠", selected: false },
  { label: "透明感", selected: true },
  { label: "陽キャバイブス", selected: false },
  { label: "ミステリアス", selected: false },
  { label: "天才的バカ", selected: true },
  { label: "ギャップの鬼", selected: false },
  { label: "天然毒舌", selected: false },
  { label: "頼れる相棒", selected: false },
  { label: "深夜テンション", selected: false },
] as const;

export const metadata: Metadata = {
  title: "AuraMaker | 友達から見た自分のオーラがわかる",
  description: SERVICE_SHARE_TEXT,
  openGraph: {
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description: SERVICE_SHARE_TEXT,
    type: "website",
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "AuraMaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description: SERVICE_SHARE_TEXT,
    images: ["/brand/og.png"],
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
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-violet-300/50 bg-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/30"
          >
            マイオーラ / ダッシュボード
          </Link>
          <Link
            href="/auras"
            className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            📖 オーラ図鑑を見る
          </Link>
        </div>

        <section className="rounded-3xl border border-white/20 bg-black/35 p-5 backdrop-blur sm:p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-200 sm:text-sm">AuraMaker</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            周りからどう思われてるか、知りたくない？
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">
            友達にURLを送り、キーワードを選んでもらうだけで自分のオーラがわかる。
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

          <div className="mt-8">
            <p className="text-sm font-semibold text-white/75">
              友達はこんなキーワードから最大3つ選ぶだけ
            </p>
            <div className="mt-3 flex flex-wrap gap-2" aria-hidden>
              {LANDING_EXAMPLE_WORDS.map((word) => (
                <span
                  key={word.label}
                  className={
                    word.selected
                      ? "rounded-full bg-violet-300 px-3 py-2 text-sm font-semibold text-black"
                      : "rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white/85"
                  }
                >
                  {word.label}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-white/55">
              URLを送る → キーワード選択 → オーラ完成
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-black/30 p-6 text-center backdrop-blur sm:p-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-violet-200">AURA ENCYCLOPEDIA</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            全{AURA_TYPES.length}種類のオーラ図鑑
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
            MBTIみたいな他人から見たタイプ診断。系統ごとに分かれたオーラを図鑑でチェック。
          </p>
          <Link
            href="/auras"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] sm:text-base"
          >
            図鑑を開く
          </Link>
        </section>
      </div>
    </main>
  );
}
