import type { Metadata } from "next";
import Link from "next/link";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import { AURA_TYPES } from "@/lib/constants/auras";
import { SERVICE_SHARE_TEXT } from "@/lib/constants/share";

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

export default function Home() {
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
