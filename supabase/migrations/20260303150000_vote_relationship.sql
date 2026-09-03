-- Friend vote context: relationship (required for new friend votes) + optional nickname.
-- Self-votes leave these null. Existing rows stay null (legacy).

alter table public.votes
  add column if not exists relationship_type text,
  add column if not exists voter_display_name text;

alter table public.vote_sessions
  add column if not exists relationship_type text,
  add column if not exists voter_display_name text;

alter table public.votes
  drop constraint if exists votes_relationship_type_check;

alter table public.votes
  add constraint votes_relationship_type_check
  check (
    relationship_type is null
    or relationship_type in ('close_friend', 'partner', 'coworker', 'family', 'other')
  );

alter table public.vote_sessions
  drop constraint if exists vote_sessions_relationship_type_check;

alter table public.vote_sessions
  add constraint vote_sessions_relationship_type_check
  check (
    relationship_type is null
    or relationship_type in ('close_friend', 'partner', 'coworker', 'family', 'other')
  );

create index if not exists votes_target_relationship_idx
  on public.votes (target_user_id, relationship_type)
  where is_self_vote = false and relationship_type is not null;
