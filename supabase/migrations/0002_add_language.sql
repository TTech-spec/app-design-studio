-- AGRICON NG — persist selected locale on the profile once authenticated

alter table public.profiles
  add column if not exists language text not null default 'en';
