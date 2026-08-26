import { redirect } from "next/navigation";
import AuraBackground from "@/components/AuraBackground";
import { normalizeVoteWords } from "@/lib/votes/validate";
import { resolveSiteUrl } from "@/lib/utils/site-url";
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
        <section className="relative z-10 rounded-2xl border border-white/20 bg-black/40 p-8 text-center backdrop-blur">
          <h1 className="text-2xl font-black">ユーザーが見つかりません</h1>
        </section>
      </main>
    );
  }

  const { data: votes } = await supabase
    .from("votes")
    .select("word, is_self_vote")
    .eq("target_user_id", userId);

  const friendWords = (votes ?? [])
    .filter((vote) => !vote.is_self_vote)
    .map((vote) => vote.word);
  const selfWords = (votes ?? [])
    .filter((vote) => vote.is_self_vote)
    .map((vote) => vote.word);
  const targetAuraWords = friendWords.length > 0 ? friendWords : selfWords;
  const siteUrl = await resolveSiteUrl();

  return (
    <SuccessClient
      targetDisplayName={profile.display_name ?? "名無しのオーラ使い"}
      targetAuraWords={targetAuraWords}
      voterWords={voterWords}
      siteUrl={siteUrl}
    />
  );
}
