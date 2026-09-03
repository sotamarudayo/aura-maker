export const VOTE_RELATIONSHIPS = [
  "close_friend",
  "partner",
  "coworker",
  "family",
  "other",
] as const;

export type VoteRelationship = (typeof VOTE_RELATIONSHIPS)[number];

export const MAX_VOTER_DISPLAY_NAME_LENGTH = 20;

export function isVoteRelationship(value: unknown): value is VoteRelationship {
  return typeof value === "string" && (VOTE_RELATIONSHIPS as readonly string[]).includes(value);
}

export function normalizeVoterDisplayName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_VOTER_DISPLAY_NAME_LENGTH);
}
