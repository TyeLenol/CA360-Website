create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text not null default '',
  caption text,
  credit text,
  kind text not null default 'other' check (kind in ('mentor_portrait', 'article_cover', 'session_image', 'site_asset', 'other')),
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  is_public boolean not null default false,
  linked_type text,
  linked_id uuid,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index media_assets_kind_status_idx on public.media_assets (kind, status, updated_at desc);
create index media_assets_linked_id_idx on public.media_assets (linked_id);

create trigger media_assets_set_updated_at
  before update on public.media_assets
  for each row execute function public.set_updated_at();

alter table public.media_assets enable row level security;
revoke all on table public.media_assets from anon, authenticated;
grant select on table public.media_assets to anon, authenticated;
grant insert, update on table public.media_assets to authenticated;
grant delete on table public.media_assets to authenticated;

create policy "Public can read published media assets"
  on public.media_assets for select
  to anon, authenticated
  using (is_public = true and status = 'published');

create policy "Studio can read all media assets"
  on public.media_assets for select
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio editors can create media assets"
  on public.media_assets for insert
  to authenticated
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (created_by is null or created_by = (select auth.uid()))
  );

create policy "Studio editors can update media assets"
  on public.media_assets for update
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]))
  with check (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]));

create policy "Admins can delete media assets"
  on public.media_assets for delete
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ca360-media',
  'ca360-media',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = true,
    file_size_limit = 6291456,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Studio editors can upload library media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'ca360-media'
    and (storage.foldername(name))[1] = 'library'
    and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
  );

create policy "Studio editors can update library media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'ca360-media'
    and (storage.foldername(name))[1] = 'library'
    and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
  )
  with check (
    bucket_id = 'ca360-media'
    and (storage.foldername(name))[1] = 'library'
    and private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
  );

create policy "Admins can delete library media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'ca360-media'
    and (storage.foldername(name))[1] = 'library'
    and private.has_studio_role(ARRAY['admin'::public.studio_role])
  );
