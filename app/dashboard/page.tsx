import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loadDashboardFusions } from "@/lib/fusion/load-dashboard-fusions";
import { resolveAnonymousDisplayName } from "@/lib/utils/nickname";
import { resolveSiteUrl } from "@/lib/utils/site-url";
import DashboardClient from "./DashboardClient";

type DashboardPageProps = {
  searchParams: Promise<{ fusion?: string }>;
};

function fallbackName(email?: string | null) {
  if (!email) return "Anonymous";
  return email.split("@")[0] || "Anonymous";
}

function resolveDisplayName(
  user: {
    is_anonymous?: boolean;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
  existingName?: string | null,
) {
  if (existingName) return existingName;
  if (user.is_anonymous) return resolveAnonymousDisplayName();
  return (
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    fallbackName(user.email)
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { fusion: fusionParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, self_vote_completed")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = resolveDisplayName(user, profile?.display_name);

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      display_name: displayName,
      self_vote_completed: false,
    });
    redirect("/onboarding/self-vote");
  }

  if (!profile.display_name) {
    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);
  }

  if (!profile.self_vote_completed) {
    redirect("/onboarding/self-vote");
  }

  const [{ data: votes }, siteUrl, initialFusions] = await Promise.all([
    supabase
      .from("votes")
      .select("word, is_self_vote, relationship_type, voter_display_name")
      .eq("target_user_id", user.id),
    resolveSiteUrl(),
    loadDashboardFusions(user.id),
  ]);

  return (
    <DashboardClient
      userId={user.id}
      initialDisplayName={displayName}
      initialVotes={(votes ?? []).map((vote) => ({
        word: vote.word,
        isSelfVote: vote.is_self_vote ?? false,
        relationshipType: vote.relationship_type ?? null,
        voterDisplayName: vote.voter_display_name ?? null,
      }))}
      initialIsAnonymous={user.is_anonymous ?? false}
      initialFusions={initialFusions}
      fusionJustAccepted={fusionParam === "1"}
      siteUrl={siteUrl}
    />
  );
}
