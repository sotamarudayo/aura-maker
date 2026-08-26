export type RawVoteRow = {
  word: string;
  isSelfVote: boolean;
  voterFingerprint: string | null;
};

export type VoterSession = {
  fingerprint: string;
  words: string[];
  label: string;
};

export function groupVoterSessions(votes: RawVoteRow[]): VoterSession[] {
  const map = new Map<string, string[]>();

  for (const vote of votes) {
    if (vote.isSelfVote || !vote.voterFingerprint) continue;
    const existing = map.get(vote.voterFingerprint) ?? [];
    existing.push(vote.word);
    map.set(vote.voterFingerprint, existing);
  }

  return Array.from(map.entries()).map(([fingerprint, words], index) => {
    const primary = words[0];
    return {
      fingerprint,
      words,
      label: primary ? `「${primary}」派の友達` : `匿名の友達 #${index + 1}`,
    };
  });
}
