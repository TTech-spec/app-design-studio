-- AGRICON NG — Auth + Verification schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query > Run).

-- 1. profiles table -----------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  whatsapp text,
  user_type text check (user_type in ('farmer', 'distributor')),
  date_of_birth date,
  gender text,
  state text,
  address text,
  avatar_url text,
  farm_name text,
  farm_size_hectares numeric,
  farm_state text,
  farm_lga text,
  primary_crops text[],
  business_name text,
  business_type text,
  rc_number text,
  years_in_operation int,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- auto-create a profile row whenever a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. verification_documents table ---------------------------------------
create table if not exists public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  doc_type text not null check (
    doc_type in ('government_id', 'proof_of_ownership', 'farm_photo', 'business_registration')
  ),
  file_path text not null,
  created_at timestamptz not null default now()
);

alter table public.verification_documents enable row level security;

drop policy if exists "docs_select_own" on public.verification_documents;
create policy "docs_select_own" on public.verification_documents
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "docs_insert_own" on public.verification_documents;
create policy "docs_insert_own" on public.verification_documents
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "docs_delete_own" on public.verification_documents;
create policy "docs_delete_own" on public.verification_documents
  for delete to authenticated
  using (auth.uid() = user_id);

-- 3. Storage bucket for verification documents ---------------------------
insert into storage.buckets (id, name, public)
values ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;

drop policy if exists "verification_docs_owner_select" on storage.objects;
create policy "verification_docs_owner_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "verification_docs_owner_insert" on storage.objects;
create policy "verification_docs_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "verification_docs_owner_update" on storage.objects;
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

drop policy if exists "verification_docs_owner_delete" on storage.objects;
create policy "verification_docs_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'verification-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );
