-- DarlTech Academy — table access for the website (Data API)
-- Some Supabase projects don't give the website's keys access to new tables
-- automatically. This grants it table by table (skipping any that don't exist).
-- Row-level security policies still decide which rows each person can use.
-- Safe to re-run.

grant usage on schema public to anon, authenticated;

do $$
declare t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public' and tablename like 'academy\_%'
  loop
    -- signed-in users; RLS limits them to the rows they're allowed
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    raise notice 'granted %', t;
  end loop;

  -- visitors who aren't signed in
  if to_regclass('public.academy_applications') is not null then
    grant insert on public.academy_applications to anon;
  end if;
  if to_regclass('public.academy_settings') is not null then
    grant select on public.academy_settings to anon;
  end if;
  if to_regclass('public.academy_courses') is not null then
    grant select on public.academy_courses to anon;
  end if;
  if to_regclass('public.academy_quizzes') is not null then
    grant select on public.academy_quizzes to anon;
  end if;
end $$;

-- functions the website calls
do $$
begin
  if to_regprocedure('public.is_academy_admin()') is not null then
    grant execute on function public.is_academy_admin() to anon, authenticated;
  end if;
  if to_regprocedure('public.academy_tutor_submissions()') is not null then
    grant execute on function public.academy_tutor_submissions() to authenticated;
  end if;
  if to_regprocedure('public.academy_community_stats()') is not null then
    grant execute on function public.academy_community_stats() to authenticated;
  end if;
end $$;

-- tables created later get the same access automatically
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

-- refresh the API so it sees the changes straight away
notify pgrst, 'reload schema';

-- check: lists every academy table and whether signed-in users can write to it
select tablename,
       has_table_privilege('authenticated', 'public.' || tablename, 'INSERT') as signed_in_can_write
from pg_tables
where schemaname = 'public' and tablename like 'academy\_%'
order by tablename;
