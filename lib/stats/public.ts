import { AURA_TYPES } from "@/lib/constants/auras";
import { createAdminClient } from "@/utils/supabase/admin";

export type PublicStats = {
  friendVoteCount: number;
  auraTypeCount: number;
};

/** LP社会的証明用。失敗時は安全なフォールバック。 */
export async function getPublicStats(): Promise<PublicStats> {
  const auraTypeCount = AURA_TYPES.length;
  try {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("is_self_vote", false);
    if (error) {
      return { friendVoteCount: 0, auraTypeCount };
    }
    return { friendVoteCount: count ?? 0, auraTypeCount };
  } catch {
    return { friendVoteCount: 0, auraTypeCount };
  }
}
