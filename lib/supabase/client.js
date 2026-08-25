'use client';

import { createBrowserClient } from '@supabase/ssr';

let browserClient;

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Vercel may prerender the login page before deployment variables are added.
  // Return a controlled null state so the page can explain the configuration issue.
  if (!supabaseUrl || !supabasePublishableKey) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
  }

  return browserClient;
}
