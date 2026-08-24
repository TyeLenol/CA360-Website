alter table public.newsletter_subscribers
  add constraint newsletter_email_unique unique (email);

drop index if exists public.newsletter_subscribers_email_unique;
