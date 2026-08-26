-- Self-vote + duplicate vote prevention
-- Apply in Supabase SQL Editor or via CLI.

-- 1) votes: self-vote flag + voter fingerprint
ALTER TABLE public.votes
  ADD COLUMN IF NOT EXISTS is_self_vote boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS voter_fingerprint text;

CREATE INDEX IF NOT EXISTS votes_target_self_idx
  ON public.votes (target_user_id, is_self_vote);

-- 2) profiles: onboarding flag
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS self_vote_completed boolean NOT NULL DEFAULT false;

-- 3) vote_sessions: 24h dedup ledger (enforced in API)
CREATE TABLE IF NOT EXISTS public.vote_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  voter_fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vote_sessions_dedup_idx
  ON public.vote_sessions (target_user_id, voter_fingerprint, created_at DESC);

-- Self-vote batch is guarded by profiles.self_vote_completed + API (not a unique index on votes).
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "votes_select_public" ON public.votes;
CREATE POLICY "votes_select_public"
  ON public.votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "votes_no_direct_insert" ON public.votes;
CREATE POLICY "votes_no_direct_insert"
  ON public.votes FOR INSERT
  WITH CHECK (false);

ALTER TABLE public.vote_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vote_sessions_no_public" ON public.vote_sessions;
CREATE POLICY "vote_sessions_no_public"
  ON public.vote_sessions FOR ALL
  USING (false)
  WITH CHECK (false);
