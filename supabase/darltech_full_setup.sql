-- ============================================================
-- DarlTech Academy — COMPLETE Supabase setup (run all at once)
-- SQL Editor > New query > paste everything > Run. Safe to re-run.
-- Edit the email in PART 3 to your own before running.
-- ============================================================

-- PART 1: admin dashboard, applications, payments, courses, settings

-- 1. Admins -------------------------------------------------------------
create table if not exists public.academy_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.academy_admins enable row level security;

-- security definer so policies can call it without recursion
create or replace function public.is_academy_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.academy_admins where user_id = auth.uid());
$$;
grant execute on function public.is_academy_admin() to anon, authenticated;

drop policy if exists "admins_read_self" on public.academy_admins;
create policy "admins_read_self" on public.academy_admins
  for select using (user_id = auth.uid() or public.is_academy_admin());

-- 2. Shared updated_at trigger -----------------------------------------
create or replace function public.academy_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3. Members (students and tutors) --------------------------------------
create table if not exists public.academy_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'student' check (role in ('student', 'tutor')),
  track text,
  status text not null default 'active' check (status in ('active', 'pending', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists academy_members_email_role on public.academy_members (lower(email), role);

-- 4. Courses ------------------------------------------------------------
create table if not exists public.academy_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null default 'Beginner' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  weeks int not null default 12 check (weeks > 0),
  price numeric not null default 0 check (price >= 0),
  tutor_name text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Applications (Cohort / scholarship) --------------------------------
create table if not exists public.academy_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  track text not null,
  cohort text not null default 'Cohort 2',
  scholarship boolean not null default true,
  motivation text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'waitlisted')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Payments -----------------------------------------------------------
create table if not exists public.academy_payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.academy_applications (id) on delete set null,
  payer_name text not null,
  email text,
  amount numeric not null check (amount >= 0),
  currency text not null default 'NGN',
  purpose text not null default 'commitment_fee' check (purpose in ('commitment_fee', 'tuition', 'certificate', 'other')),
  reference text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Settings (single row) ---------------------------------------------
create table if not exists public.academy_settings (
  id int primary key default 1 check (id = 1),
  cohort_name text not null default 'Cohort 2',
  applications_open boolean not null default true,
  commitment_fee numeric not null default 50000,
  support_email text,
  whatsapp_number text,
  updated_at timestamptz not null default now()
);
insert into public.academy_settings (id) values (1) on conflict (id) do nothing;

-- 8. Triggers + RLS -----------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['academy_members','academy_courses','academy_applications','academy_payments','academy_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.academy_touch_updated_at()', t || '_touch', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
    execute format('create policy %I on public.%I for all using (public.is_academy_admin()) with check (public.is_academy_admin())', t || '_admin_all', t);
  end loop;
end $$;

-- Anyone (including the public landing page) may submit an application.
drop policy if exists "applications_public_insert" on public.academy_applications;
create policy "applications_public_insert" on public.academy_applications
  for insert to anon, authenticated
  with check (status = 'pending' and admin_note is null);

-- Anyone may read published courses and public settings.
drop policy if exists "courses_public_read" on public.academy_courses;
create policy "courses_public_read" on public.academy_courses
  for select using (status = 'published');
drop policy if exists "settings_public_read" on public.academy_settings;
create policy "settings_public_read" on public.academy_settings
  for select using (true);

-- 9. Realtime: live updates on the admin dashboard ---------------------
do $$
declare t text;
begin
  foreach t in array array['academy_members','academy_courses','academy_applications','academy_payments'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;


-- PART 2: student & tutor accounts and all their data

-- 1. Profiles: one row per signed-up student or tutor --------------------
create table if not exists public.academy_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'tutor')),
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  interests text[] not null default '{}',
  level text not null default '',
  bio text not null default '',
  skills text[] not null default '{}',
  experience text,
  link text,
  availability text[],
  status text check (status in ('pending', 'approved')),
  -- app progress and preferences
  tour_done boolean not null default false,
  profile_done boolean not null default false,
  preview_watched boolean not null default false,
  cart text[] not null default '{}',
  owned text[] not null default '{}',
  follows text[] not null default '{}',
  likes text[] not null default '{}',
  messages jsonb not null default '{}',
  shares jsonb not null default '{}',
  plus jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enrollments ---------------------------------------------------------
create table if not exists public.academy_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  plan text not null default 'full' check (plan in ('full', 'scholarship')),
  progress int not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- 3. Quiz attempts -------------------------------------------------------
create table if not exists public.academy_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_id text not null,
  score int not null,
  correct int not null,
  total int not null,
  answers int[] not null default '{}',
  minutes int not null default 0,
  source text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists academy_quiz_attempts_user on public.academy_quiz_attempts (user_id, created_at desc);

-- 4. Tutor-made quizzes --------------------------------------------------
create table if not exists public.academy_quizzes (
  id text primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Community / tech feed posts ----------------------------------------
create table if not exists public.academy_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- 6. Link admin "Users" list to real accounts ----------------------------
alter table public.academy_members add column if not exists user_id uuid references auth.users (id) on delete set null;

create or replace function public.academy_sync_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_members (user_id, full_name, email, phone, role, track, status)
  values (
    new.id,
    coalesce(nullif(new.name, ''), split_part(new.email, '@', 1)),
    new.email,
    nullif(new.phone, ''),
    new.role,
    coalesce(new.interests[1], new.skills[1]),
    case when new.status = 'pending' then 'pending' else 'active' end
  )
  on conflict ((lower(email)), role) do update set
    user_id = excluded.user_id,
    full_name = excluded.full_name,
    phone = excluded.phone,
    track = coalesce(excluded.track, academy_members.track),
    status = case when academy_members.status = 'suspended' then 'suspended' else excluded.status end;
  return new;
end;
$$;

drop trigger if exists academy_profiles_sync on public.academy_profiles;
create trigger academy_profiles_sync
  after insert or update of name, email, phone, role, interests, skills, status on public.academy_profiles
  for each row execute function public.academy_sync_member();

-- Approving a tutor in the admin "Users" page approves their account too.
create or replace function public.academy_member_to_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is not null and new.role = 'tutor' and new.status is distinct from old.status then
    update public.academy_profiles
      set status = case when new.status = 'active' then 'approved' else 'pending' end
      where id = new.user_id and status is distinct from (case when new.status = 'active' then 'approved' else 'pending' end);
  end if;
  return new;
end;
$$;
drop trigger if exists academy_members_to_profile on public.academy_members;
create trigger academy_members_to_profile
  after update of status on public.academy_members
  for each row execute function public.academy_member_to_profile();

-- 7. updated_at triggers -------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['academy_profiles','academy_enrollments','academy_quizzes'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.academy_touch_updated_at()', t || '_touch', t);
  end loop;
end $$;

-- 8. Row-level security --------------------------------------------------
alter table public.academy_profiles enable row level security;
alter table public.academy_enrollments enable row level security;
alter table public.academy_quiz_attempts enable row level security;
alter table public.academy_quizzes enable row level security;
alter table public.academy_posts enable row level security;

-- Profiles: you manage your own; admins see everyone.
drop policy if exists "profiles_own" on public.academy_profiles;
create policy "profiles_own" on public.academy_profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "profiles_admin" on public.academy_profiles;
create policy "profiles_admin" on public.academy_profiles
  for all using (public.is_academy_admin()) with check (public.is_academy_admin());
-- A user can't approve themselves as a tutor.
create or replace function public.academy_guard_status()
returns trigger language plpgsql as $$
begin
  if not public.is_academy_admin() and auth.uid() is not null then
    if tg_op = 'INSERT' then
      if new.role = 'tutor' then new.status := 'pending'; else new.status := null; end if;
    elsif new.status is distinct from old.status or new.role is distinct from old.role then
      new.status := old.status;
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists academy_profiles_guard on public.academy_profiles;
create trigger academy_profiles_guard
  before insert or update on public.academy_profiles
  for each row execute function public.academy_guard_status();

-- Enrollments and attempts: your own rows; admins see all.
drop policy if exists "enrollments_own" on public.academy_enrollments;
create policy "enrollments_own" on public.academy_enrollments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "enrollments_admin" on public.academy_enrollments;
create policy "enrollments_admin" on public.academy_enrollments
  for all using (public.is_academy_admin()) with check (public.is_academy_admin());

drop policy if exists "attempts_own_read" on public.academy_quiz_attempts;
create policy "attempts_own_read" on public.academy_quiz_attempts
  for select using (user_id = auth.uid() or public.is_academy_admin());
drop policy if exists "attempts_own_insert" on public.academy_quiz_attempts;
create policy "attempts_own_insert" on public.academy_quiz_attempts
  for insert with check (user_id = auth.uid());
drop policy if exists "attempts_admin" on public.academy_quiz_attempts;
create policy "attempts_admin" on public.academy_quiz_attempts
  for all using (public.is_academy_admin()) with check (public.is_academy_admin());

-- Quizzes: anyone can read (shared quiz links), tutors manage their own.
drop policy if exists "quizzes_read" on public.academy_quizzes;
create policy "quizzes_read" on public.academy_quizzes for select using (true);
drop policy if exists "quizzes_own" on public.academy_quizzes;
create policy "quizzes_own" on public.academy_quizzes
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "quizzes_admin" on public.academy_quizzes;
create policy "quizzes_admin" on public.academy_quizzes
  for all using (public.is_academy_admin()) with check (public.is_academy_admin());

-- Posts: signed-in users read all, write/delete their own; admins moderate.
drop policy if exists "posts_read" on public.academy_posts;
create policy "posts_read" on public.academy_posts for select to authenticated using (true);
drop policy if exists "posts_insert_own" on public.academy_posts;
create policy "posts_insert_own" on public.academy_posts for insert with check (user_id = auth.uid());
drop policy if exists "posts_delete_own" on public.academy_posts;
create policy "posts_delete_own" on public.academy_posts for delete using (user_id = auth.uid() or public.is_academy_admin());

-- 9. Live updates --------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['academy_enrollments','academy_quiz_attempts','academy_posts'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- PART 2b: community, announcements, events, tutor insights

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

-- PART 2c: no email confirmation (auto-confirm every new account)

create or replace function public.academy_auto_confirm_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists academy_auto_confirm_email on auth.users;
create trigger academy_auto_confirm_email
  before insert on auth.users
  for each row execute function public.academy_auto_confirm_email();

-- Confirm everyone who already signed up but never confirmed.
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;

-- PART 2d: give the website access to the tables (RLS still applies)

grant usage on schema public to anon, authenticated;

-- Signed-in users (students, tutors, admins): RLS limits them to their own rows
grant select, insert, update, delete on
  public.academy_admins,
  public.academy_members,
  public.academy_courses,
  public.academy_applications,
  public.academy_payments,
  public.academy_settings,
  public.academy_profiles,
  public.academy_enrollments,
  public.academy_quiz_attempts,
  public.academy_quizzes,
  public.academy_posts,
  public.academy_announcements,
  public.academy_events,
  public.academy_post_likes,
  public.academy_post_comments
to authenticated;

-- Visitors who aren't signed in: submit applications, read public settings,
-- published courses and shared quizzes
grant insert on public.academy_applications to anon;
grant select on public.academy_settings, public.academy_courses, public.academy_quizzes to anon;

grant execute on function public.is_academy_admin() to anon, authenticated;
grant execute on function public.academy_tutor_submissions() to authenticated;
grant execute on function public.academy_community_stats() to authenticated;

-- Refresh the API so it sees the tables straight away
notify pgrst, 'reload schema';

-- PART 3: make your account an admin (no confirmation email needed)
-- First create your login in Authentication > Users > Add user.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'your@email.com';

insert into public.academy_admins (user_id)
select id from auth.users where email = 'your@email.com'
on conflict do nothing;

