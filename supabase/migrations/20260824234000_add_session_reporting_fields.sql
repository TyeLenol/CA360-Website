alter table public.sessions
  add column if not exists category text,
  add column if not exists duration_minutes integer,
  add column if not exists attendee_count integer;

alter table public.sessions
  drop constraint if exists sessions_duration_positive,
  drop constraint if exists sessions_attendee_count_nonnegative;

alter table public.sessions
  add constraint sessions_duration_positive check (duration_minutes is null or duration_minutes > 0),
  add constraint sessions_attendee_count_nonnegative check (attendee_count is null or attendee_count >= 0);
