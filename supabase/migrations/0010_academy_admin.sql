-- DarlTech Academy — admin dashboard schema
-- Run once in the Supabase SQL Editor (Dashboard > SQL Editor > New query > Run).
-- Safe to re-run.

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

-- 10. Make yourself an admin -------------------------------------------
-- After signing up in the app, run (with your own email):
--   insert into public.academy_admins (user_id)
--   select id from auth.users where email = 'you@example.com'
--   on conflict do nothing;
