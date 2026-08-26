"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AuraBackground from "@/components/AuraBackground";
import OpenInBrowserCta from "@/components/OpenInBrowserCta";
import { calculateAuraType } from "@/lib/constants/auras";
import type { ChemiParty } from "@/lib/chemi/calculate-chemi";
import { buildVoteThanksMessage } from "@/lib/constants/share";

const ChemiExportModal = dynamic(() => import("@/components/ChemiExportModal"), {
  ssr: false,
});

type SuccessClientProps = {
  targetDisplayName: string;
  targetAuraWords: string[];
  voterWords: string[];
  siteUrl: string;
};

export default function SuccessClient({
  targetDisplayName,
  targetAuraWords,
  voterWords,
  siteUrl,
}: SuccessClientProps) {
  const [chemiOpen, setChemiOpen] = useState(false);

  const targetResult = useMemo(
    () => calculateAuraType(targetAuraWords, { displayName: targetDisplayName }),
    [targetAuraWords, targetDisplayName],
  );
  const voterResult = useMemo(
    () => calculateAuraType(voterWords, { displayName: "あなた" }),
    [voterWords],
  );

  const partyA: ChemiParty = {
    displayName: targetDisplayName,
    aura: targetResult.aura,
    topWords: targetResult.topWords,
  };
  const partyB: ChemiParty = {
    displayName: "あなた",
    aura: voterResult.aura,
    topWords: voterResult.topWords,
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
      <AuraBackground />
      <section className="relative z-10 w-full min-w-0 max-w-xl rounded-2xl border border-white/20 bg-black/40 p-5 text-center backdrop-blur sm:p-8">
        <h1 className="text-2xl font-black leading-tight sm:text-3xl">投票ありがとう！</h1>
        <p className="mt-3 text-white/80">{buildVoteThanksMessage(targetDisplayName)}</p>

        <button
          type="button"
          onClick={() => setChemiOpen(true)}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-4 text-base font-black leading-snug text-black shadow-lg sm:text-lg"
        >
          ✨ {targetDisplayName}さんとのオーラ相性を混ぜる（ケミカードを作る）
        </button>

        <div className="mt-4 space-y-3">
          <Link
            href="/"
            className="block rounded-full bg-violet-300 px-4 py-3 text-center text-sm font-bold leading-snug text-black sm:px-5"
          >
            このままオーラ診断を始める
          </Link>
          <OpenInBrowserCta
            href="/"
            inAppOnly
            className="block rounded-full border border-white/30 bg-white/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-white sm:px-5"
            label="Safari / Chromeで開いて診断する"
          />
        </div>
      </section>

      <ChemiExportModal
        open={chemiOpen}
        onClose={() => setChemiOpen(false)}
        partyA={partyA}
        partyB={partyB}
        siteUrl={siteUrl}
      />
    </main>
  );
}
