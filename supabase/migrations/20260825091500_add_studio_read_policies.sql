create policy "Studio can read all mentors"
  on public.mentors for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio can read all specialties"
  on public.mentor_specialties for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio can read all sessions"
  on public.sessions for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio can read all newsletter subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio can read all registrations"
  on public.session_registrations for select
  to authenticated
  using (public.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));
