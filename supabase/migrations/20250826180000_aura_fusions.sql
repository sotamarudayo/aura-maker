-- Real aura fusion (friend link) — apply in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.aura_fusions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

CREATE INDEX IF NOT EXISTS aura_fusions_inviter_idx
  ON public.aura_fusions (inviter_id, status);

CREATE INDEX IF NOT EXISTS aura_fusions_invitee_idx
  ON public.aura_fusions (invitee_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS aura_fusions_pair_unique
  ON public.aura_fusions (inviter_id, invitee_id)
  WHERE invitee_id IS NOT NULL AND status = 'accepted';

ALTER TABLE public.aura_fusions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "aura_fusions_select_own" ON public.aura_fusions;
CREATE POLICY "aura_fusions_select_own"
  ON public.aura_fusions FOR SELECT
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- Writes go through service-role API routes.
DROP POLICY IF EXISTS "aura_fusions_no_direct_write" ON public.aura_fusions;
CREATE POLICY "aura_fusions_no_direct_write"
  ON public.aura_fusions FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS "aura_fusions_no_direct_update" ON public.aura_fusions;
CREATE POLICY "aura_fusions_no_direct_update"
  ON public.aura_fusions FOR UPDATE
  USING (false);
