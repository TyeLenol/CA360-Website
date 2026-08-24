-- CA360 initial production schema
-- Scope: public mentor/session discovery, private submissions, and future authenticated workflows.

create extension if not exists pgcrypto;

create type public.user_role as enum ('student', 'mentor', 'admin');
create type public.mentor_status as enum ('active', 'paused', 'application_only');
create type public.request_status as enum ('new', 'reviewing', 'matched', 'declined', 'closed');
create type public.contact_topic as enum ('student', 'mentor', 'school_partner', 'general');
create type public.submission_status as enum ('new', 'reviewing', 'replied', 'closed');
create type public.session_format as enum ('online', 'in_person', 'hybrid');
create type public.session_status as enum ('draft', 'open', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  display_name text,
  email text,
  phone text,
  institution text,
  year_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.mentors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  slug text not null unique,
  name text not null,
  role_label text not null,
  positioning text not null,
  path_summary text not null,
  quote text,
  field text not null,
  status public.mentor_status not null default 'application_only',
  is_public boolean not null default false,
  accepting_requests boolean not null default false,
  avatar_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.mentor_specialties (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentors (id) on delete cascade,
  specialty text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (mentor_id, specialty)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  field text,
  format public.session_format not null,
  venue text,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity integer,
  status public.session_status not null default 'draft',
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint sessions_capacity_positive check (capacity is null or capacity > 0),
  constraint sessions_time_order check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.mentor_requests (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid references public.profiles (id) on delete set null,
  preferred_mentor_id uuid references public.mentors (id) on delete set null,
  matched_mentor_id uuid references public.mentors (id) on delete set null,
  name text not null,
  email text not null,
  institution text,
  year_label text,
  field_interest text,
  goals text not null,
  matching_answers jsonb not null default '{}'::jsonb,
  recommendation_reason text,
  status public.request_status not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  topic public.contact_topic not null default 'general',
  name text not null,
  email text not null,
  phone text,
  message text not null,
  selected_mentor_id uuid references public.mentors (id) on delete set null,
  status public.submission_status not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  profile_id uuid references public.profiles (id) on delete set null,
  source text not null default 'website',
  is_subscribed boolean not null default true,
  subscribed_at timestamptz not null default timezone('utc', now()),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint newsletter_email_lowercase check (email = lower(email)),
  constraint newsletter_unsubscribe_time check (is_subscribed or unsubscribed_at is not null)
);

create unique index newsletter_subscribers_email_unique
  on public.newsletter_subscribers (lower(email));

create table public.session_registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  institution text,
  year_label text,
  attended boolean,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index session_registrations_session_email_unique
  on public.session_registrations (session_id, lower(email));

create index mentors_public_status_idx on public.mentors (is_public, status);
create index mentors_profile_id_idx on public.mentors (profile_id);
create index mentor_specialties_mentor_id_idx on public.mentor_specialties (mentor_id);
create index sessions_public_status_start_idx on public.sessions (is_public, status, starts_at);
create index mentor_requests_student_profile_id_idx on public.mentor_requests (student_profile_id);
create index mentor_requests_status_idx on public.mentor_requests (status);
create index mentor_requests_matched_mentor_id_idx on public.mentor_requests (matched_mentor_id);
create index contact_messages_profile_id_idx on public.contact_messages (profile_id);
create index contact_messages_status_idx on public.contact_messages (status);
create index session_registrations_profile_id_idx on public.session_registrations (profile_id);
create index session_registrations_session_id_idx on public.session_registrations (session_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger mentors_set_updated_at
  before update on public.mentors
  for each row execute function public.set_updated_at();
create trigger sessions_set_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();
create trigger mentor_requests_set_updated_at
  before update on public.mentor_requests
  for each row execute function public.set_updated_at();
create trigger contact_messages_set_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();
create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

-- Every public table is locked down explicitly before narrow grants are added.
alter table public.profiles enable row level security;
alter table public.mentors enable row level security;
alter table public.mentor_specialties enable row level security;
alter table public.sessions enable row level security;
alter table public.mentor_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.session_registrations enable row level security;

revoke all on table public.profiles, public.mentors, public.mentor_specialties, public.sessions,
  public.mentor_requests, public.contact_messages, public.newsletter_subscribers,
  public.session_registrations from anon, authenticated;

grant select on table public.mentors, public.mentor_specialties, public.sessions to anon, authenticated;
grant insert on table public.mentor_requests, public.contact_messages, public.newsletter_subscribers,
  public.session_registrations to anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, update on table public.mentor_requests, public.contact_messages,
  public.newsletter_subscribers, public.session_registrations to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;

-- Public discovery is limited to explicitly approved records.
create policy "Public can read approved mentors"
  on public.mentors for select
  to anon, authenticated
  using (is_public = true and status = 'active');

create policy "Public can read specialties for approved mentors"
  on public.mentor_specialties for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.mentors
      where public.mentors.id = mentor_specialties.mentor_id
        and public.mentors.is_public = true
        and public.mentors.status = 'active'
    )
  );

create policy "Public can read open public sessions"
  on public.sessions for select
  to anon, authenticated
  using (is_public = true and status in ('open', 'completed'));

-- A signed-in user may manage only their own profile.
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Anonymous form inserts are allowed; submissions are never publicly readable.
create policy "Anyone can submit a mentor request"
  on public.mentor_requests for insert
  to anon, authenticated
  with check (
    (student_profile_id is null or student_profile_id = (select auth.uid()))
  );

create policy "Users can read their own mentor requests"
  on public.mentor_requests for select
  to authenticated
  using ((select auth.uid()) = student_profile_id);

create policy "Users can update their own mentor requests"
  on public.mentor_requests for update
  to authenticated
  using ((select auth.uid()) = student_profile_id)
  with check ((select auth.uid()) = student_profile_id);

create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    (profile_id is null or profile_id = (select auth.uid()))
  );

create policy "Users can read their own contact messages"
  on public.contact_messages for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (
    email = lower(email)
    and (profile_id is null or profile_id = (select auth.uid()))
  );

create policy "Users can read their own newsletter subscription"
  on public.newsletter_subscribers for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "Users can update their own newsletter subscription"
  on public.newsletter_subscribers for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "Anyone can register for a public session"
  on public.session_registrations for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.sessions
      where public.sessions.id = session_registrations.session_id
        and public.sessions.is_public = true
        and public.sessions.status = 'open'
    )
    and (profile_id is null or profile_id = (select auth.uid()))
  );

create policy "Users can read their own registrations"
  on public.session_registrations for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "Users can update their own registrations"
  on public.session_registrations for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

-- No anon/authenticated write policy exists for mentors or sessions.
-- Admin workflows will be added server-side after staff authentication is designed.
