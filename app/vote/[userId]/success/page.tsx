import Link from "next/link";
import { redirect } from "next/navigation";
import AuraBackground from "@/components/AuraBackground";
import { normalizeVoteWords } from "@/lib/votes/validate";
import { createClient } from "@/utils/supabase/server";
import SuccessClient from "./SuccessClient";

type SuccessPageProps = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ words?: string }>;
};

export default async function VoteSuccessPage({ params, searchParams }: SuccessPageProps) {
  const { userId } = await params;
  const { words: wordsParam } = await searchParams;
  const voterWords = normalizeVoteWords(
    wordsParam?.split(",").map((word) => decodeURIComponent(word.trim())) ?? [],
  );

  if (voterWords.length === 0) {
    redirect(`/vote/${userId}`);
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-4 py-10 text-white">
        <AuraBackground />
        <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-black/40 p-8 text-center backdrop-blur">
          <h1 className="text-2xl font-black">投票先が見つかりません</h1>
          <p className="mt-2 text-white/80">
            URLが古い・途中で切れている可能性があります。自分の診断を始めるならこちら。
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black"
          >
            自分のオーラ診断を始める
          </Link>
        </section>
      </main>
    );
  }

  return (
    <SuccessClient targetDisplayName={profile.display_name ?? "名無しのオーラ使い"} />
  );
}
