import { calculateAuraType } from "@/lib/constants/auras";
import type { ChemiParty } from "@/lib/chemi/calculate-chemi";

export function buildChemiParty(
  displayName: string,
  words: string[],
  userId?: string,
): ChemiParty {
  const result = calculateAuraType(words, { userId, displayName });
  return {
    displayName,
    aura: result.aura,
    topWords: result.topWords,
  };
}
