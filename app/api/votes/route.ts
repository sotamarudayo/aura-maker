import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import {
  buildSelfVoteFingerprint,
  buildVoterFingerprint,
  createVoterId,
  VOTE_DEDUP_HOURS,
  VOTER_COOKIE_NAME,
} from "@/lib/votes/fingerprint";
import {
  isVoteRelationship,
  normalizeVoterDisplayName,
  type VoteRelationship,
} from "@/lib/votes/relationship";
import { MAX_VOTE_WORDS, MIN_VOTE_WORDS, normalizeVoteWords } from "@/lib/votes/validate";

type VoteInsertRow = {
  target_user_id: string;
  word: string;
  is_self_vote: boolean;
  voter_fingerprint: string;
  relationship_type: VoteRelationship | null;
  voter_display_name: string | null;
};

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

function dedupSinceIso() {
  return new Date(Date.now() - VOTE_DEDUP_HOURS * 60 * 60 * 1000).toISOString();
}

async function hasRecentVoteSession(
  admin: ReturnType<typeof createAdminClient>,
  targetUserId: string,
  fingerprint: string,
) {
  const { data } = await admin
    .from("vote_sessions")
    .select("id")
    .eq("target_user_id", targetUserId)
    .eq("voter_fingerprint", fingerprint)
    .gte("created_at", dedupSinceIso())
    .limit(1)
    .maybeSingle();

  if (data) return true;

  const { data: voteRow } = await admin
    .from("votes")
    .select("id")
    .eq("target_user_id", targetUserId)
    .eq("voter_fingerprint", fingerprint)
    .eq("is_self_vote", false)
    .gte("created_at", dedupSinceIso())
    .limit(1)
    .maybeSingle();

  return Boolean(voteRow);
}

export async function GET(request: NextRequest) {
  const targetUserId = request.nextUrl.searchParams.get("targetUserId");
  if (!targetUserId) {
    return jsonError("targetUserId is required.", 400, "missing_target");
  }

  try {
    const admin = createAdminClient();
    const voterId = request.cookies.get(VOTER_COOKIE_NAME)?.value ?? createVoterId();
    const fingerprint = buildVoterFingerprint(request, voterId);
    const alreadyVoted = await hasRecentVoteSession(admin, targetUserId, fingerprint);
    return NextResponse.json({ alreadyVoted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Status check failed.";
    return jsonError(message, 500, "server_error");
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400, "invalid_json");
  }

  const record = body as {
    targetUserId?: unknown;
    words?: unknown;
    isSelfVote?: unknown;
    relationship?: unknown;
    voterDisplayName?: unknown;
  };

  const targetUserId =
    typeof record.targetUserId === "string" ? record.targetUserId.trim() : "";
  const isSelfVote = record.isSelfVote === true;
  const words = normalizeVoteWords(record.words);
  const relationship = isVoteRelationship(record.relationship) ? record.relationship : null;
  const voterDisplayName = normalizeVoterDisplayName(record.voterDisplayName);

  if (!targetUserId) {
    return jsonError("targetUserId is required.", 400, "missing_target");
  }
  if (words.length < MIN_VOTE_WORDS || words.length > MAX_VOTE_WORDS) {
    return jsonError(`Select ${MIN_VOTE_WORDS} to ${MAX_VOTE_WORDS} valid words.`, 400, "invalid_words");
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vote API is not configured.";
    return jsonError(message, 503, "misconfigured");
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("id, self_vote_completed")
    .eq("id", targetUserId)
    .maybeSingle();

  if (!profile) {
    return jsonError("Target profile not found.", 404, "profile_not_found");
  }

  if (isSelfVote) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== targetUserId) {
      return jsonError("Self vote requires authentication as the profile owner.", 401, "auth_required");
    }
    if (profile.self_vote_completed) {
      return jsonError("Self vote already completed.", 409, "self_vote_done");
    }

    const { data: existingSelfVote } = await admin
      .from("votes")
      .select("id")
      .eq("target_user_id", targetUserId)
      .eq("is_self_vote", true)
      .limit(1)
      .maybeSingle();

    if (existingSelfVote) {
      await admin.from("profiles").update({ self_vote_completed: true }).eq("id", targetUserId);
      return jsonError("Self vote already completed.", 409, "self_vote_done");
    }

    const fingerprint = buildSelfVoteFingerprint(user.id);
    const rows: VoteInsertRow[] = words.map((word) => ({
      target_user_id: targetUserId,
      word,
      is_self_vote: true,
      voter_fingerprint: fingerprint,
      relationship_type: null,
      voter_display_name: null,
    }));

    const { error: insertError } = await admin.from("votes").insert(rows);
    if (insertError) {
      if (insertError.code === "23505") {
        return jsonError("Self vote already completed.", 409, "self_vote_done");
      }
      return jsonError(insertError.message, 500, "insert_failed");
    }

    const { error: profileError } = await admin
      .from("profiles")
      .update({ self_vote_completed: true })
      .eq("id", targetUserId);

    if (profileError) {
      return jsonError(profileError.message, 500, "profile_update_failed");
    }

    return NextResponse.json({ ok: true, isSelfVote: true });
  }

  if (!relationship) {
    return jsonError("relationship is required.", 400, "missing_relationship");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === targetUserId) {
    return jsonError("Use self-vote onboarding for your own profile.", 403, "self_vote_required");
  }

  let voterId = request.cookies.get(VOTER_COOKIE_NAME)?.value;
  const newVoterId = !voterId;
  if (!voterId) {
    voterId = createVoterId();
  }

  const fingerprint = buildVoterFingerprint(request, voterId);
  if (await hasRecentVoteSession(admin, targetUserId, fingerprint)) {
    return jsonError(
      `You already voted for this person within the last ${VOTE_DEDUP_HOURS} hours.`,
      409,
      "duplicate_vote",
    );
  }

  const rows: VoteInsertRow[] = words.map((word) => ({
    target_user_id: targetUserId,
    word,
    is_self_vote: false,
    voter_fingerprint: fingerprint,
    relationship_type: relationship,
    voter_display_name: voterDisplayName,
  }));

  const { error: insertError } = await admin.from("votes").insert(rows);
  if (insertError) {
    return jsonError(insertError.message, 500, "insert_failed");
  }

  const { error: sessionError } = await admin.from("vote_sessions").insert({
    target_user_id: targetUserId,
    voter_fingerprint: fingerprint,
    relationship_type: relationship,
    voter_display_name: voterDisplayName,
  });

  if (sessionError) {
    return jsonError(sessionError.message, 500, "session_failed");
  }

  const response = NextResponse.json({ ok: true, isSelfVote: false });
  if (newVoterId) {
    response.cookies.set(VOTER_COOKIE_NAME, voterId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return response;
}
