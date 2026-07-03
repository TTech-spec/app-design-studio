-- Create storage buckets for chat files and product images

-- Chat files bucket (images, documents, voice notes)
insert into storage.buckets (id, name, public)
values ('chat-files', 'chat-files', true)
on conflict (id) do nothing;

-- Products images bucket
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Chat files policies
drop policy if exists "chat_files_public_select" on storage.objects;
create policy "chat_files_public_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'chat-files');

drop policy if exists "chat_files_insert" on storage.objects;
create policy "chat_files_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'chat-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

-- Products images policies
drop policy if exists "products_public_select" on storage.objects;
create policy "products_public_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'products');

drop policy if exists "products_insert" on storage.objects;
create policy "products_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'products'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "products_update" on storage.objects;
create policy "products_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'products'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'products'
    and split_part(name, '/', 1) = auth.uid()::text
  );

-- Avatars policies
drop policy if exists "avatars_public_select" on storage.objects;
create policy "avatars_public_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars');

drop policy if exists "avatars_insert" on storage.objects;
create policy "avatars_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "avatars_update" on storage.objects;
create policy "avatars_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and split_part(name, '/', 1) = auth.uid()::text
  );
