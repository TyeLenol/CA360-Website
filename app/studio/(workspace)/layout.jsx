import { redirect } from 'next/navigation';
import { StudioLayout } from '../../../components/studio/StudioLayout';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export default async function StudioWorkspaceLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  if (!claims?.sub) redirect('/studio/login');

  const { data: member, error } = await supabase
    .from('studio_members')
    .select('user_id, role, display_name, is_active')
    .eq('user_id', claims.sub)
    .maybeSingle();

  if (error || !member?.is_active) redirect('/studio/login?error=access');

  return <StudioLayout member={member}>{children}</StudioLayout>;
}
