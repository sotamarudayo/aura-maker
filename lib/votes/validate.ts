import { getVoteWordDef } from "@/lib/constants/words";

export const MAX_VOTE_WORDS = 3;
export const MIN_VOTE_WORDS = 1;

export function normalizeVoteWords(words: unknown): string[] {
  if (!Array.isArray(words)) return [];
  const unique: string[] = [];
  for (const item of words) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed || unique.includes(trimmed)) continue;
    if (!getVoteWordDef(trimmed)) continue;
    unique.push(trimmed);
    if (unique.length >= MAX_VOTE_WORDS) break;
  }
  return unique;
}
