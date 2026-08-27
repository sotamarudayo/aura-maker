import { pickAuraWords } from "@/lib/aura/pick-aura-words";
import { buildChemiParty } from "@/lib/chemi/build-party";
import type { ChemiParty } from "@/lib/chemi/calculate-chemi";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export type DashboardFusionPartner = {
  fusionId: string;
  partnerId: string;
  partnerDisplayName: string;
  partnerArchetypeName: string;
  partnerParty: ChemiParty;
  acceptedAt: string;
};

export type DashboardFusionPending = {
  fusionId: string;
  inviteToken: string;
  createdAt: string;
};

export type DashboardFusions = {
  partners: DashboardFusionPartner[];
  pendingInvites: DashboardFusionPending[];
};

export async function loadDashboardFusions(userId: string): Promise<DashboardFusions> {
  const supabase = await createClient();
  const { data: fusions } = await supabase
    .from("aura_fusions")
    .select("id, inviter_id, invitee_id, invite_token, status, created_at, accepted_at")
    .or(`inviter_id.eq.${userId},invitee_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (!fusions?.length) {
    return { partners: [], pendingInvites: [] };
  }

  const pendingInvites = fusions
    .filter((fusion) => fusion.status === "pending" && fusion.inviter_id === userId)
    .map((fusion) => ({
      fusionId: fusion.id,
      inviteToken: fusion.invite_token,
      createdAt: fusion.created_at,
    }));

  const accepted = fusions.filter(
    (fusion) => fusion.status === "accepted" && fusion.invitee_id,
  );

  if (accepted.length === 0) {
    return { partners: [], pendingInvites };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { partners: [], pendingInvites };
  }

  const partnerIds = [
    ...new Set(
      accepted.map((fusion) =>
        fusion.inviter_id === userId ? fusion.invitee_id! : fusion.inviter_id,
      ),
    ),
  ];

  const [{ data: profiles }, ...voteResults] = await Promise.all([
    admin.from("profiles").select("id, display_name").in("id", partnerIds),
    ...partnerIds.map((partnerId) =>
      admin.from("votes").select("word, is_self_vote").eq("target_user_id", partnerId),
    ),
  ]);

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.display_name ?? "友達"]),
  );
  const votesMap = new Map(
    partnerIds.map((partnerId, index) => [partnerId, voteResults[index]?.data ?? []]),
  );

  const partners = accepted.map((fusion) => {
    const partnerId = fusion.inviter_id === userId ? fusion.invitee_id! : fusion.inviter_id;
    const displayName = profileMap.get(partnerId) ?? "友達";
    const words = pickAuraWords(votesMap.get(partnerId) ?? []);
    const partnerParty = buildChemiParty(displayName, words, partnerId);

    return {
      fusionId: fusion.id,
      partnerId,
      partnerDisplayName: displayName,
      partnerArchetypeName: partnerParty.aura.archetypeName,
      partnerParty,
      acceptedAt: fusion.accepted_at ?? fusion.created_at,
    };
  });

  return { partners, pendingInvites };
}
