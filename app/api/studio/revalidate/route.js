import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const { data: member, error } = await supabase
    .from('studio_members')
    .select('user_id, is_active')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !member?.is_active) {
    return NextResponse.json({ error: 'Studio access required.' }, { status: 403 });
  }

  revalidatePath('/', 'page');
  revalidatePath('/mentorship', 'page');
  revalidatePath('/mentorship/[slug]', 'page');

  return NextResponse.json({ revalidated: true });
}
