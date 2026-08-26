import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { calculateAuraType } from "@/lib/constants/auras";
import { pickAuraWords } from "@/lib/aura/pick-aura-words";
import FusionAcceptClient from "./FusionAcceptClient";

type FusionPageProps = {
  params: Promise<{ token: string }>;
};

export default async function FusionPage({ params }: FusionPageProps) {
  const { token } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return (
      <FusionAcceptClient
        token={token}
        inviterName="友達"
        inviterAuraName="？"
        status="missing"
        isLoggedIn={Boolean(user)}
        needsSelfVote={false}
        isOwnLink={false}
        alreadyPartner={false}
      />
    );
  }

  const { data: fusion } = await admin
    .from("aura_fusions")
    .select("id, inviter_id, invitee_id, status")
    .eq("invite_token", token)
    .maybeSingle();

  if (!fusion) {
    return (
      <FusionAcceptClient
        token={token}
        inviterName="友達"
        inviterAuraName="？"
        status="missing"
        isLoggedIn={Boolean(user)}
        needsSelfVote={false}
        isOwnLink={false}
        alreadyPartner={false}
      />
    );
  }

  const [{ data: inviterProfile }, { data: inviterVotes }, { data: myProfile }] = await Promise.all([
    admin.from("profiles").select("display_name").eq("id", fusion.inviter_id).maybeSingle(),
    admin.from("votes").select("word, is_self_vote").eq("target_user_id", fusion.inviter_id),
    user
      ? admin.from("profiles").select("self_vote_completed").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const inviterWords = pickAuraWords(inviterVotes ?? []);
  const inviterAura = calculateAuraType(inviterWords, {
    displayName: inviterProfile?.display_name ?? "友達",
  });

  return (
    <FusionAcceptClient
      token={token}
      inviterName={inviterProfile?.display_name ?? "友達"}
      inviterAuraName={inviterAura.aura.archetypeName}
      status={fusion.status === "accepted" ? "accepted" : "pending"}
      isLoggedIn={Boolean(user)}
      needsSelfVote={Boolean(user) && !myProfile?.self_vote_completed}
      isOwnLink={user?.id === fusion.inviter_id}
      alreadyPartner={Boolean(user && fusion.invitee_id === user.id)}
    />
  );
}
