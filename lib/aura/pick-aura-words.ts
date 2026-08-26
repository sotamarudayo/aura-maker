export type VoteWordRow = {
  word: string;
  is_self_vote?: boolean | null;
};

/** Friend votes first; fall back to self-diagnosis words. */
export function pickAuraWords(votes: VoteWordRow[]): string[] {
  const friendWords = votes.filter((vote) => !vote.is_self_vote).map((vote) => vote.word);
  if (friendWords.length > 0) return friendWords;
  return votes.filter((vote) => vote.is_self_vote).map((vote) => vote.word);
}
