-- DarlTech Academy — table access for the website (Data API)
-- Some Supabase projects don't give the website's keys access to new tables
-- automatically. This grants it explicitly. Row-level security policies still
-- decide exactly which rows each person can read or change.
-- Safe to re-run.

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
