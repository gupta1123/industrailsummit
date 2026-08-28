-- Post-closure Industrial Summit interest list. These submissions are separate
-- from paid summit_applications and from link-only entries. They do not create
-- payment orders or confirmation emails.

create table public.summit_waitlist_registrations (
  id bigint generated always as identity primary key,
  submission_token uuid not null default gen_random_uuid() unique,
  registration_type text not null default 'individual' check (
    registration_type in ('individual', 'corporate')
  ),
  company_name text check (
    company_name is null or char_length(trim(company_name)) between 1 and 120
  ),
  attendee_count integer not null default 1 check (attendee_count >= 1),
  first_name text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name text not null check (char_length(trim(last_name)) between 1 and 80),
  phone text not null check (phone ~ '^[0-9]{10}$'),
  email text check (email is null or char_length(trim(email)) between 3 and 320),
  industry text check (
    industry is null or char_length(trim(industry)) between 1 and 120
  ),
  profession text check (
    profession is null or char_length(trim(profession)) between 1 and 120
  ),
  designation text check (
    designation is null or char_length(trim(designation)) between 1 and 120
  ),
  place text check (place is null or char_length(trim(place)) between 1 and 120),
  participation_purpose text check (
    participation_purpose is null
    or char_length(trim(participation_purpose)) between 1 and 180
  ),
  meeting_requests text[] not null default '{}',
  summit_expectations text check (
    summit_expectations is null or char_length(trim(summit_expectations)) <= 1200
  ),
  source text not null default 'registrations_closed' check (source = 'registrations_closed'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (
      registration_type = 'individual'
      and attendee_count = 1
      and company_name is null
      and email is not null
      and industry is not null
      and profession is not null
      and designation is not null
      and place is not null
      and participation_purpose is not null
    )
    or
    (
      registration_type = 'corporate'
      and attendee_count >= 2
      and company_name is not null
    )
  )
);

create index summit_waitlist_registrations_created_at_idx
  on public.summit_waitlist_registrations (created_at desc);

create index summit_waitlist_registrations_registration_type_idx
  on public.summit_waitlist_registrations (registration_type);

create index summit_waitlist_registrations_email_idx
  on public.summit_waitlist_registrations (lower(email));

create index summit_waitlist_registrations_phone_idx
  on public.summit_waitlist_registrations (phone);

alter table public.summit_waitlist_registrations enable row level security;

revoke all on table public.summit_waitlist_registrations from anon, authenticated;
revoke all on sequence public.summit_waitlist_registrations_id_seq from anon, authenticated;

grant select, insert on table public.summit_waitlist_registrations to service_role;
grant usage, select on sequence public.summit_waitlist_registrations_id_seq to service_role;

create trigger set_summit_waitlist_registrations_updated_at
before update on public.summit_waitlist_registrations
for each row execute function public.set_summit_updated_at();
