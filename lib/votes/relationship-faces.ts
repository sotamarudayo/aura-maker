import {
  isVoteRelationship,
  VOTE_RELATIONSHIPS,
  type VoteRelationship,
} from "@/lib/votes/relationship";

export type RelationshipVoteInput = {
  word: string;
  isSelfVote: boolean;
  relationshipType: string | null;
};

export type RelationshipFaceGroup = {
  relationship: VoteRelationship;
  words: string[];
};

/** 友達票を関係性ごとにまとめる（レガシー票＝関係性なしは除外） */
export function groupFriendVotesByRelationship(
  votes: RelationshipVoteInput[],
): RelationshipFaceGroup[] {
  const buckets = new Map<VoteRelationship, string[]>();

  for (const vote of votes) {
    if (vote.isSelfVote) continue;
    if (!isVoteRelationship(vote.relationshipType)) continue;
    const list = buckets.get(vote.relationshipType) ?? [];
    list.push(vote.word);
    buckets.set(vote.relationshipType, list);
  }

  return VOTE_RELATIONSHIPS.filter((id) => (buckets.get(id)?.length ?? 0) > 0).map((id) => ({
    relationship: id,
    words: buckets.get(id) ?? [],
  }));
}
