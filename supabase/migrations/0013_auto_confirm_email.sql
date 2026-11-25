-- DarlTech Academy — no email confirmation
-- Marks every new account's email as confirmed the moment it is created,
-- so students and tutors can log in straight after signing up.
-- Safe to re-run.

create or replace function public.academy_auto_confirm_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists academy_auto_confirm_email on auth.users;
create trigger academy_auto_confirm_email
  before insert on auth.users
  for each row execute function public.academy_auto_confirm_email();

-- Confirm everyone who already signed up but never confirmed.
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;
