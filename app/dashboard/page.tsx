import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { resolveAnonymousDisplayName } from "@/lib/utils/nickname";
import { resolveSiteUrl } from "@/lib/utils/site-url";
import DashboardClient from "./DashboardClient";

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

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = resolveDisplayName(user, profile?.display_name);

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      display_name: displayName,
    });
  } else if (!profile.display_name) {
    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);
  }

  const { data: votes } = await supabase
    .from("votes")
    .select("word")
    .eq("target_user_id", user.id);

  const siteUrl = await resolveSiteUrl();

  return (
    <DashboardClient
      userId={user.id}
      initialDisplayName={displayName}
      initialWords={(votes ?? []).map((vote) => vote.word)}
      initialIsAnonymous={user.is_anonymous ?? false}
      siteUrl={siteUrl}
    />
  );
}
