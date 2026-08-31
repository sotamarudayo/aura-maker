import { redirect } from "next/navigation";
import SuccessClient from "./SuccessClient";
import VoteNotFoundContent from "@/components/VoteNotFoundContent";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";
import { normalizeVoteWords } from "@/lib/votes/validate";
import { createClient } from "@/utils/supabase/server";

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
    return <VoteNotFoundContent />;
  }

  const locale = await getServerLocale();
  const messages = getMessages(locale);

  return (
    <SuccessClient targetDisplayName={profile.display_name ?? messages.common.anonymousName} />
  );
}
