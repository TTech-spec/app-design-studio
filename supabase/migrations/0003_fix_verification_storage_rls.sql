-- Fix RLS for verification document uploads (storage + table)
-- Run in Supabase Dashboard → SQL Editor if uploads fail with
-- "new row violates row-level security policy".

-- 1. Ensure the private bucket exists
insert into storage.buckets (id, name, public)
values ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;

-- 2. Storage policies — users may only access files under their own folder (userId/…)
drop policy if exists "verification_docs_owner_select" on storage.objects;
drop policy if exists "verification_docs_owner_insert" on storage.objects;
drop policy if exists "verification_docs_owner_update" on storage.objects;
drop policy if exists "verification_docs_owner_delete" on storage.objects;

create policy "verification_docs_owner_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "verification_docs_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "verification_docs_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "verification_docs_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

-- 3. Table policies — users may only manage their own document rows
drop policy if exists "docs_select_own" on public.verification_documents;
drop policy if exists "docs_insert_own" on public.verification_documents;
drop policy if exists "docs_delete_own" on public.verification_documents;

create policy "docs_select_own" on public.verification_documents
  for select to authenticated
  using (auth.uid() = user_id);

create policy "docs_insert_own" on public.verification_documents
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "docs_delete_own" on public.verification_documents
  for delete to authenticated
  using (auth.uid() = user_id);
