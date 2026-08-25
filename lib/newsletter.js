import { supabase } from './supabase';

export async function subscribeToNewsletter(email, source = 'website') {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(normalizedEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (!supabase) {
    return { ok: false, message: 'Newsletter sign-up is temporarily unavailable. Please try again soon.' };
  }
  const { error } = await supabase.from('newsletter_subscribers').insert({
    email: normalizedEmail,
    source,
    is_subscribed: true,
    subscribed_at: new Date().toISOString(),
  });
  if (error && error.code !== '23505') {
    console.error('Newsletter signup failed:', error);
    return { ok: false, message: 'We could not save that just now. Please try again in a moment.' };
  }
  return { ok: true };
}
