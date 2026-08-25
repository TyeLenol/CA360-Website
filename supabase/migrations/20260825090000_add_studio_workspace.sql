create type public.studio_role as enum ('admin', 'coordinator', 'editor', 'read_only');

create table public.studio_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.studio_role not null default 'coordinator',
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.request_activity (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.mentor_requests (id) on delete cascade,
  actor_user_id uuid references auth.users (id) on delete set null,
  activity_type text not null default 'note',
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index studio_members_role_active_idx on public.studio_members (role, is_active);
create index request_activity_request_created_idx on public.request_activity (request_id, created_at desc);

create trigger studio_members_set_updated_at
  before update on public.studio_members
  for each row execute function public.set_updated_at();

create or replace function public.has_studio_role(allowed_roles public.studio_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.studio_members
    where user_id = (select auth.uid())
      and is_active = true
      and role = any (allowed_roles)
  );
$$;

grant execute on function public.has_studio_role(public.studio_role[]) to authenticated;

alter table public.studio_members enable row level security;
alter table public.request_activity enable row level security;

revoke all on table public.studio_members, public.request_activity from anon, authenticated;
grant select, insert, update, delete on table public.studio_members to authenticated;
grant select, insert on table public.request_activity to authenticated;

grant insert, update, delete on table public.mentor_specialties to authenticated;
grant insert, update, delete on table public.mentors to authenticated;
grant insert, update, delete on table public.sessions to authenticated;
grant update on table public.mentor_requests, public.contact_messages to authenticated;

drop policy if exists "Users can read their own studio membership" on public.studio_members;
create policy "Users can read their own studio membership"
  on public.studio_members for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Admins can read all studio memberships"
  on public.studio_members for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role]));

create policy "Admins can create studio memberships"
  on public.studio_members for insert
  to authenticated
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role]));

create policy "Admins can update studio memberships"
  on public.studio_members for update
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role]))
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role]));

create policy "Admins can delete studio memberships"
  on public.studio_members for delete
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role]));

create policy "Studio can read request activity"
  on public.request_activity for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio can add request activity"
  on public.request_activity for insert
  to authenticated
  with check (
    public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role])
    and actor_user_id = (select auth.uid())
  );

create policy "Studio can read all mentor requests"
  on public.mentor_requests for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Coordinators can update mentor requests"
  on public.mentor_requests for update
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

create policy "Studio can read all contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Coordinators can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

create policy "Operators can create mentors"
  on public.mentors for insert
  to authenticated
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

create policy "Operators can update mentors"
  on public.mentors for update
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

create policy "Admins can delete mentors"
  on public.mentors for delete
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role]));

create policy "Operators can create specialties"
  on public.mentor_specialties for insert
  to authenticated
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

create policy "Operators can update specialties"
  on public.mentor_specialties for update
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

create policy "Admins can delete specialties"
  on public.mentor_specialties for delete
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role]));

create policy "Operators can create sessions"
  on public.sessions for insert
  to authenticated
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]));

create policy "Operators can update sessions"
  on public.sessions for update
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]))
  with check (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]));

create policy "Admins can delete sessions"
  on public.sessions for delete
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role]));
