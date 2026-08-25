create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.has_studio_role(allowed_roles public.studio_role[])
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

grant execute on function private.has_studio_role(public.studio_role[]) to authenticated;

alter policy "Admins can read all studio memberships" on public.studio_members
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));
alter policy "Admins can create studio memberships" on public.studio_members
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role]));
alter policy "Admins can update studio memberships" on public.studio_members
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role]));
alter policy "Admins can delete studio memberships" on public.studio_members
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

alter policy "Studio can read request activity" on public.request_activity
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Studio can add request activity" on public.request_activity
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role])
    and actor_user_id = (select auth.uid())
  );

alter policy "Studio can read all mentor requests" on public.mentor_requests
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Coordinators can update mentor requests" on public.mentor_requests
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

alter policy "Studio can read all contact messages" on public.contact_messages
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Coordinators can update contact messages" on public.contact_messages
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));

alter policy "Operators can create mentors" on public.mentors
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));
alter policy "Operators can update mentors" on public.mentors
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));
alter policy "Admins can delete mentors" on public.mentors
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

alter policy "Operators can create specialties" on public.mentor_specialties
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));
alter policy "Operators can update specialties" on public.mentor_specialties
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]));
alter policy "Admins can delete specialties" on public.mentor_specialties
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

alter policy "Operators can create sessions" on public.sessions
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]));
alter policy "Operators can update sessions" on public.sessions
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]));
alter policy "Admins can delete sessions" on public.sessions
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

alter policy "Studio can read all mentors" on public.mentors
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Studio can read all specialties" on public.mentor_specialties
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Studio can read all sessions" on public.sessions
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Studio can read all newsletter subscribers" on public.newsletter_subscribers
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
alter policy "Studio can read all registrations" on public.session_registrations
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

revoke all on function public.has_studio_role(public.studio_role[]) from public, anon, authenticated;
drop function public.has_studio_role(public.studio_role[]);
