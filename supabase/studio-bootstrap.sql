-- CA360 Studio first-operator bootstrap
-- 1. Create the operator in Supabase Dashboard → Authentication → Users.
-- 2. Copy that user's UUID and replace the placeholder below.
-- 3. Run this in Supabase SQL Editor. Never commit a password or service-role key.

insert into public.studio_members (user_id, role, display_name)
values (
  'REPLACE_WITH_AUTH_USER_UUID'::uuid,
  'admin',
  'CA360 Admin'
)
on conflict (user_id) do update
set role = excluded.role,
    display_name = excluded.display_name,
    is_active = true;
