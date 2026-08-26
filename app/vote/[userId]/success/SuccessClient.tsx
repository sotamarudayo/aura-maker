"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuraBackground from "@/components/AuraBackground";
import OpenInBrowserCta from "@/components/OpenInBrowserCta";
import { buildVoteThanksMessage } from "@/lib/constants/share";

type SuccessClientProps = {
  targetDisplayName: string;
};

export default function SuccessClient({ targetDisplayName }: SuccessClientProps) {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
      <AuraBackground />
      <section className="relative z-10 w-full min-w-0 max-w-xl rounded-2xl border border-white/20 bg-black/40 p-5 text-center backdrop-blur sm:p-8">
        <h1 className="text-2xl font-black leading-tight sm:text-3xl">投票ありがとう！</h1>
        <p className="mt-3 text-white/80">{buildVoteThanksMessage(targetDisplayName)}</p>

        <div className="mt-8 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-4 text-left">
          <p className="text-sm font-bold text-fuchsia-100">友達とオーラ融合するには？</p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            お互いがオーラ診断を持っている必要があります。あなたも診断を始めて、
            {targetDisplayName}さんから「オーラ融合」リンクをもらうと、本物同士の融合カードが作れます。
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-4 py-3 text-center text-sm font-black leading-snug text-black sm:px-5"
          >
            自分もオーラ診断を始める
          </Link>
          <OpenInBrowserCta
            href="/"
            inAppOnly
            className="block rounded-full border border-white/30 bg-white/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-white sm:px-5"
            label="Safari / Chromeで開いて診断する"
          />
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-white/50 underline-offset-2 hover:underline"
          >
            戻る
          </button>
        </div>
      </section>
    </main>
  );
}
