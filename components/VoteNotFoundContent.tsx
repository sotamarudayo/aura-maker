"use client";

import Link from "next/link";
import AuraBackground from "@/components/AuraBackground";
import { useLocale } from "@/components/LocaleProvider";

export default function VoteNotFoundContent() {
  const { t } = useLocale();

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10 text-white">
      <AuraBackground />
      <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-black/40 p-8 text-center backdrop-blur">
        <h1 className="text-2xl font-black">{t.voteFlow.notFoundTitle}</h1>
        <p className="mt-2 text-white/80">{t.voteFlow.notFoundSub}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black"
        >
          {t.voteFlow.startDiagnosis}
        </Link>
      </section>
    </main>
  );
}
