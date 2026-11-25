-- DarlTech Academy — community, announcements, events, tutor insights
-- Requires 0010 and 0011. Safe to re-run.

-- 1. Announcements (written by admins) -----------------------------------
create table if not exists public.academy_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  pinned boolean not null default false,
  audience text not null default 'all' check (audience in ('all', 'students', 'tutors')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Events and live classes (written by admins) ---------------------------
create table if not exists public.academy_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default 'live_class' check (kind in ('live_class', 'community', 'deadline')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  link text,
  host text,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Post likes and comments -----------------------------------------------
create table if not exists public.academy_post_likes (
  post_id uuid not null references public.academy_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.academy_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.academy_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  author text not null,
  text text not null check (length(text) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists academy_post_comments_post on public.academy_post_comments (post_id, created_at);

-- 4. Triggers + RLS ----------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['academy_announcements','academy_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.academy_touch_updated_at()', t || '_touch', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
    execute format('create policy %I on public.%I for all using (public.is_academy_admin()) with check (public.is_academy_admin())', t || '_admin_all', t);
    execute format('drop policy if exists %I on public.%I', t || '_read', t);
    execute format('create policy %I on public.%I for select to authenticated using (true)', t || '_read', t);
  end loop;
end $$;

alter table public.academy_post_likes enable row level security;
drop policy if exists "likes_read" on public.academy_post_likes;
create policy "likes_read" on public.academy_post_likes for select to authenticated using (true);
drop policy if exists "likes_own" on public.academy_post_likes;
create policy "likes_own" on public.academy_post_likes for insert with check (user_id = auth.uid());
drop policy if exists "likes_delete_own" on public.academy_post_likes;
create policy "likes_delete_own" on public.academy_post_likes for delete using (user_id = auth.uid());

alter table public.academy_post_comments enable row level security;
drop policy if exists "comments_read" on public.academy_post_comments;
create policy "comments_read" on public.academy_post_comments for select to authenticated using (true);
drop policy if exists "comments_insert_own" on public.academy_post_comments;
create policy "comments_insert_own" on public.academy_post_comments for insert with check (user_id = auth.uid());
drop policy if exists "comments_delete" on public.academy_post_comments;
create policy "comments_delete" on public.academy_post_comments for delete using (user_id = auth.uid() or public.is_academy_admin());

-- 5. Tutors can see attempts on quizzes they own --------------------------
drop policy if exists "attempts_quiz_owner_read" on public.academy_quiz_attempts;
create policy "attempts_quiz_owner_read" on public.academy_quiz_attempts
  for select using (exists (select 1 from public.academy_quizzes q where q.id = quiz_id and q.owner_id = auth.uid()));

-- Submissions on my quizzes, with the student's name (only for the quiz owner).
create or replace function public.academy_tutor_submissions()
returns table (
  id uuid, quiz_id text, quiz_title text, user_id uuid, student_name text,
  score int, correct int, total int, created_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select a.id, a.quiz_id, q.data->>'title', a.user_id,
         coalesce(nullif(p.name, ''), 'Student'), a.score, a.correct, a.total, a.created_at
  from public.academy_quiz_attempts a
  join public.academy_quizzes q on q.id = a.quiz_id and q.owner_id = auth.uid()
  left join public.academy_profiles p on p.id = a.user_id
  order by a.created_at desc
  limit 200;
$$;
grant execute on function public.academy_tutor_submissions() to authenticated;

-- 6. Community stats (counts only, no personal data) -----------------------
create or replace function public.academy_community_stats()
returns table (members bigint, active_week bigint, students bigint, tutors bigint)
language sql stable security definer set search_path = public as $$
  select count(*),
         count(*) filter (where updated_at > now() - interval '7 days'),
         count(*) filter (where role = 'student'),
         count(*) filter (where role = 'tutor')
  from public.academy_profiles;
$$;
grant execute on function public.academy_community_stats() to authenticated;

-- 7. Live updates ---------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['academy_announcements','academy_events','academy_post_likes','academy_post_comments'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
