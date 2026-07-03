-- Add bio/about_me field to profiles table
alter table public.profiles
add column if not exists bio text;

-- Add index for bio search
create index if not exists profiles_bio_idx on public.profiles using gin(to_tsvector('english', bio));
