alter table public.mentors
  add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mentor-images',
  'mentor-images',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = true,
    file_size_limit = 6291456,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Studio operators can upload mentor images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'mentor-images'
  and (storage.foldername(name))[1] = 'mentors'
  and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role])
);

create policy "Studio operators can update mentor images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'mentor-images'
  and (storage.foldername(name))[1] = 'mentors'
  and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role])
)
with check (
  bucket_id = 'mentor-images'
  and (storage.foldername(name))[1] = 'mentors'
  and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role])
);

create policy "Studio operators can delete mentor images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'mentor-images'
  and (storage.foldername(name))[1] = 'mentors'
  and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role])
);
