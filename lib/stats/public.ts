import { AURA_TYPES, type AuraType } from "@/lib/constants/auras";
import { createAdminClient } from "@/utils/supabase/admin";

export type PopularAuraStat = {
  id: string;
  archetypeName: string;
  score: number;
};

export type PublicStats = {
  friendVoteCount: number;
  auraTypeCount: number;
  popularAuras: PopularAuraStat[];
};

function scoreAurasFromWords(words: string[]): PopularAuraStat[] {
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    if (!word) continue;
    wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
  }

  const scored = AURA_TYPES.filter((aura) => aura.rarity !== "secret").map((aura: AuraType) => {
    let score = 0;
    for (const keyword of aura.keywords) {
      score += wordCounts.get(keyword) ?? 0;
    }
    return {
      id: aura.id,
      archetypeName: aura.archetypeName,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.archetypeName.localeCompare(b.archetypeName, "ja"));
  const withHits = scored.filter((item) => item.score > 0).slice(0, 4);
  if (withHits.length > 0) return withHits;

  // 票が少ない初期はコモン寄りの定番を出す
  return ["sunrise-hero", "healing-mint", "chaos-neon", "soft-peach"]
    .map((id) => AURA_TYPES.find((aura) => aura.id === id))
    .filter((aura): aura is AuraType => Boolean(aura))
    .map((aura) => ({ id: aura.id, archetypeName: aura.archetypeName, score: 0 }));
}

/** LP・図鑑の社会的証明用。失敗時は安全なフォールバック。 */
export async function getPublicStats(): Promise<PublicStats> {
  const auraTypeCount = AURA_TYPES.length;
  const fallbackPopular = scoreAurasFromWords([]);

  try {
    const admin = createAdminClient();
    const [{ count, error: countError }, { data: recentVotes, error: votesError }] =
      await Promise.all([
        admin.from("votes").select("*", { count: "exact", head: true }).eq("is_self_vote", false),
        admin
          .from("votes")
          .select("word")
          .eq("is_self_vote", false)
          .order("created_at", { ascending: false })
          .limit(4000),
      ]);

    if (countError) {
      return { friendVoteCount: 0, auraTypeCount, popularAuras: fallbackPopular };
    }

    const words = votesError ? [] : (recentVotes ?? []).map((row) => row.word);
    return {
      friendVoteCount: count ?? 0,
      auraTypeCount,
      popularAuras: scoreAurasFromWords(words),
    };
  } catch {
    return { friendVoteCount: 0, auraTypeCount, popularAuras: fallbackPopular };
  }
}
