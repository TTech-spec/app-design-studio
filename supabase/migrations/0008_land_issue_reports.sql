-- Land issue reports table for users to report land/plot issues
create table if not exists public.land_issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  land_reference text not null,
  issue_type text not null check (
    issue_type in (
      'boundary_dispute',
      'encroachment',
      'illegal_activity',
      'environmental',
      'access_blocked',
      'other'
    )
  ),
  description text not null,
  location_state text not null,
  location_lga text not null,
  coordinates text,
  photos text[] default '{}',
  contact_phone text,
  contact_email text,
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'resolved', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.land_issue_reports enable row level security;

-- Users can read their own reports
create policy "land_reports_read_own" on public.land_issue_reports
  for select to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own reports
create policy "land_reports_insert_own" on public.land_issue_reports
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own reports
create policy "land_reports_update_own" on public.land_issue_reports
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own reports
create policy "land_reports_delete_own" on public.land_issue_reports
  for delete to authenticated
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists land_reports_user_idx on public.land_issue_reports(user_id);
create index if not exists land_reports_status_idx on public.land_issue_reports(status);
create index if not exists land_reports_type_idx on public.land_issue_reports(issue_type);
create index if not exists land_reports_created_idx on public.land_issue_reports(created_at desc);

-- Trigger to update updated_at
drop trigger if exists land_reports_set_updated_at on public.land_issue_reports;
create trigger land_reports_set_updated_at
  before update on public.land_issue_reports
  for each row execute procedure public.set_updated_at();
