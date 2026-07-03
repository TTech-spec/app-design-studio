-- Notifications table for user notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (
    type in (
      'message',
      'product_inquiry',
      'verification_update',
      'order_update',
      'price_alert',
      'system'
    )
  ),
  title text not null,
  body text not null,
  data jsonb,
  read boolean default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Users can read their own notifications
create policy "notifications_read_own" on public.notifications
  for select to authenticated
  using (auth.uid() = user_id);

-- System can insert notifications for users
create policy "notifications_insert_system" on public.notifications
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own notifications
create policy "notifications_delete_own" on public.notifications
  for delete to authenticated
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists notifications_user_idx on public.notifications(user_id);
create index if not exists notifications_read_idx on public.notifications(read);
create index if not exists notifications_created_idx on public.notifications(created_at desc);
create index if not exists notifications_type_idx on public.notifications(type);
