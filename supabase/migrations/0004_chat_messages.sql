-- Chat messages table for real-time messaging
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  text text,
  file_url text,
  file_type text,
  voice_url text,
  voice_transcription text,
  original_language text,
  translated_text jsonb,
  read boolean default false,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

-- Users can read messages in conversations they participate in
create policy "messages_read_participants" on public.chat_messages
  for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Users can insert messages as sender
create policy "messages_insert_sender" on public.chat_messages
  for insert to authenticated
  with check (auth.uid() = sender_id);

-- Users can update read status of messages sent to them
create policy "messages_update_read" on public.chat_messages
  for update to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

-- Indexes for performance
create index if not exists chat_messages_conversation_idx on public.chat_messages(conversation_id);
create index if not exists chat_messages_sender_idx on public.chat_messages(sender_id);
create index if not exists chat_messages_receiver_idx on public.chat_messages(receiver_id);
create index if not exists chat_messages_created_idx on public.chat_messages(created_at desc);

-- Conversation participants table
create table if not exists public.conversation_participants (
  conversation_id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references auth.users (id) on delete cascade,
  user2_id uuid not null references auth.users (id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user1_id, user2_id)
);

alter table public.conversation_participants enable row level security;

create policy "participants_read_own" on public.conversation_participants
  for select to authenticated
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "participants_insert_own" on public.conversation_participants
  for insert to authenticated
  with check (auth.uid() = user1_id or auth.uid() = user2_id);
