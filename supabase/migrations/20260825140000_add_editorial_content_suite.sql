create table public.journal_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null default '',
  category text not null check (category in ('student', 'mentor', 'guide', 'news')),
  category_label text not null,
  author text not null,
  author_role text,
  author_seed integer not null default 1,
  published_at date,
  read_time text not null default '5 min read',
  tone text not null default 'teal' check (tone in ('warm', 'teal', 'orange', 'deep', 'cream')),
  label text not null default 'STORY',
  featured boolean not null default false,
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  is_public boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index journal_articles_public_idx on public.journal_articles (is_public, status, featured, published_at desc);
create index journal_articles_category_idx on public.journal_articles (category, status, published_at desc);

create trigger journal_articles_set_updated_at
  before update on public.journal_articles
  for each row execute function public.set_updated_at();

alter table public.journal_articles enable row level security;
revoke all on table public.journal_articles from anon, authenticated;
grant select on table public.journal_articles to anon, authenticated;
grant insert, update on table public.journal_articles to authenticated;
grant delete on table public.journal_articles to authenticated;

create policy "Public can read published journal articles"
  on public.journal_articles for select
  to anon, authenticated
  using (is_public = true and status = 'published');

create policy "Studio can read all journal articles"
  on public.journal_articles for select
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio editors can create journal articles"
  on public.journal_articles for insert
  to authenticated
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (created_by is null or created_by = (select auth.uid()))
    and (status <> 'published' or private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  );

create policy "Studio editors can update journal articles"
  on public.journal_articles for update
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]))
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (status <> 'published' or private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  );

create policy "Admins can delete journal articles"
  on public.journal_articles for delete
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

create table public.site_content (
  key text primary key,
  label text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  is_public boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update on table public.site_content to authenticated;
grant delete on table public.site_content to authenticated;

create policy "Public can read published site content"
  on public.site_content for select
  to anon, authenticated
  using (is_public = true and status = 'published');

create policy "Studio can read all site content"
  on public.site_content for select
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio editors can create site content"
  on public.site_content for insert
  to authenticated
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (status <> 'published' or private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  );

create policy "Studio editors can update site content"
  on public.site_content for update
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]))
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (status <> 'published' or private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  );

create policy "Admins can delete site content"
  on public.site_content for delete
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

create table public.site_faqs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'GENERAL',
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  is_public boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index site_faqs_public_idx on public.site_faqs (is_public, status, sort_order);

create trigger site_faqs_set_updated_at
  before update on public.site_faqs
  for each row execute function public.set_updated_at();

alter table public.site_faqs enable row level security;
revoke all on table public.site_faqs from anon, authenticated;
grant select on table public.site_faqs to anon, authenticated;
grant insert, update on table public.site_faqs to authenticated;
grant delete on table public.site_faqs to authenticated;

create policy "Public can read published FAQs"
  on public.site_faqs for select
  to anon, authenticated
  using (is_public = true and status = 'published');

create policy "Studio can read all FAQs"
  on public.site_faqs for select
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role, 'read_only'::public.studio_role]));

create policy "Studio editors can create FAQs"
  on public.site_faqs for insert
  to authenticated
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (status <> 'published' or private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  );

create policy "Studio editors can update FAQs"
  on public.site_faqs for update
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role]))
  with check (
    private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role, 'editor'::public.studio_role])
    and (status <> 'published' or private.has_studio_role(ARRAY['admin'::public.studio_role, 'coordinator'::public.studio_role]))
  );

create policy "Admins can delete FAQs"
  on public.site_faqs for delete
  to authenticated
  using (private.has_studio_role(ARRAY['admin'::public.studio_role]));

insert into public.site_content (key, label, content, status, is_public)
values (
  'current_opportunity',
  'Current opportunity',
  '{"eyebrow":"Right now at CA360","title":"Cohort 06 is open.","body":"Start with the next honest conversation about what comes after SHS — then stay close as new fields, sessions and mentors open up.","primary_label":"Get cohort updates","primary_href":"#news","secondary_label":"See how it works","secondary_href":"#programs","status_label":"COHORT OPEN","metric_one_value":"2K+","metric_one_label":"STUDENTS REACHED","metric_two_value":"9/10","metric_two_label":"AVG SESSION RATING"}'::jsonb,
  'published',
  true
)
on conflict (key) do nothing;

insert into public.site_faqs (slug, category, question, answer, sort_order, status, is_public)
values
  ('who-can-attend', 'STUDENTS', 'Who can attend a session?', 'Any SHS student, recent graduate, or first-year undergrad. The Medicine track is open to SHS-3 science students and first-/second-year medical students. We have never turned anyone away for being not quite the right stage — if the topic interests you, you belong in the room.', 1, 'published', true),
  ('is-it-free', 'COSTS', 'Is it really free? What is the catch?', 'Yes — free, always. There is no catch. Sessions are funded by partner schools, individual donors, and the mentors time. Our only ask is that you show up prepared, and that you pass what you learn on to one person behind you.', 2, 'published', true),
  ('past-shs', 'STUDENTS', 'I am past SHS already. Still useful?', 'Absolutely. Roughly 40% of our community is in their first or second year of university, often re-evaluating their choice or planning for residency, internships, or grad school. The earlier the better — but it is never too late.', 3, 'published', true),
  ('become-a-mentor', 'MENTORS', 'How do I become a mentor?', 'Fill in the mentor application linked in the navigation. We ask for a short bio, the track you would mentor in, and your availability. We aim to respond within 14 days and pair you with a student within 30.', 4, 'published', true),
  ('school-visits', 'SCHOOLS', 'Do you visit schools? Can mine host you?', 'Yes. We run in-person school visits termly, by invitation. A teacher, headteacher, or student rep can reach out via the Partner form. We bring 2–3 mentors, run a 90–120 minute session, and stay for an hour of open Q&A. Free for partner schools.', 5, 'published', true),
  ('future-tracks', 'FIELDS', 'When do Law, Engineering, Business open?', 'Law in Q2 2026, Engineering in Q4 2026, Business in 2027. Each opens only when we have at least 5 mentors who have actually walked the path — we never run a track on theory alone. You can sign up for the waiting list any time.', 6, 'published', true),
  ('session-language', 'GENERAL', 'Are sessions in English?', 'Yes — sessions run in English, though mentors regularly switch to Twi, Ga, Ewe, or Hausa during open Q&A when it helps a student think more clearly. Recordings are in English with captions.', 7, 'published', true)
on conflict (slug) do nothing;

insert into public.journal_articles (slug, title, excerpt, body, category, category_label, author, author_role, author_seed, published_at, read_time, tone, label, featured, status, is_public)
values
  ('the-white-coat-unmasked', 'The white coat, unmasked: a year inside the ward.', 'Three house officers walked our biggest cohort yet through their first 12 months on the ward — the wins, the burnout, and the moments they almost quit. Plus the seven questions that broke the room.', 'Three house officers walked our biggest cohort yet through their first 12 months on the ward — the wins, the burnout, and the moments they almost quit. Plus the seven questions that broke the room.\n\nThe useful part was not a perfect route. It was hearing what changed once the title became a daily reality, and which questions made the next step more honest.', 'mentor', 'MENTOR STORY', 'Dr. A. Asare', 'Founder · CA360', 1, '2026-02-28', '8 min read', 'teal', 'INTERVIEW · KORLE BU', true, 'published', true),
  ('letter-to-the-shs-3-girl', 'A letter to the SHS-3 girl I was.', 'On picking a career by elimination, the older sister I did not have, and the kind of advice I would have actually heard at 17.', 'On picking a career by elimination, the older sister I did not have, and the kind of advice I would have actually heard at 17.\n\nYou do not need a final answer to start asking better questions.', 'mentor', 'FOUNDER ESSAY', 'Dr. A. Asare', 'Founder · CA360', 1, '2026-02-14', '5 min read', 'warm', 'ESSAY', false, 'published', true),
  ('why-we-delayed-law', 'Why we delayed the Law track — and what that taught us.', 'We almost shipped a Law cohort before we had the mentors to back it up. Here is why we pulled the plug, and the rule we made afterwards.', 'We almost shipped a Law cohort before we had the mentors to back it up. Here is why we pulled the plug, and the rule we made afterwards.', 'news', 'NEWS & UPDATES', 'CA360 Team', 'CA360 Editorial', 7, '2026-01-30', '3 min read', 'orange', 'INTERNAL', false, 'published', true),
  ('how-akua-got-into-ug-law', 'How Akua got into UG Law without a debate coach.', 'Six rejections, one acceptance, and a lot of YouTube debate replays. A first-person account from one of our SHS alumni.', 'Six rejections, one acceptance, and a lot of YouTube debate replays. A first-person account from one of our SHS alumni.', 'student', 'STUDENT STORY', 'Akua Boateng', 'CA360 Alumna', 3, '2026-01-18', '6 min read', 'deep', 'CLASS OF 2025', false, 'published', true),
  ('four-books-at-seventeen', 'The four books Dr. Mensah wishes someone gave him at 17.', 'Two on career navigation, one on self-awareness, one that has nothing to do with work. With links and a one-paragraph reason for each.', 'Two on career navigation, one on self-awareness, one that has nothing to do with work. With links and a one-paragraph reason for each.', 'guide', 'CAREER GUIDE', 'Dr. K. Mensah', 'Surgery Resident · KATH', 2, '2026-01-09', '4 min read', 'cream', 'READING LIST', false, 'published', true),
  ('medicine-by-the-numbers', 'Medicine, by the numbers: who actually gets in?', 'A look at admissions data across UGMS, KNUST and UCC over the last five intake cycles — and what it means for next year applicants.', 'A look at admissions data across UGMS, KNUST and UCC over the last five intake cycles — and what it means for next year applicants.', 'guide', 'CAREER GUIDE', 'CA360 Research', 'CA360 Research', 4, '2025-12-21', '9 min read', 'teal', 'DATA · ANNUAL', false, 'published', true),
  ('rejection-we-almost-did-not-recover-from', 'Three mentors on the rejection they almost did not recover from.', 'A residency that almost was not. A law school no. A grad scheme that came down to one phone call. Three stories, three reframes.', 'A residency that almost was not. A law school no. A grad scheme that came down to one phone call. Three stories, three reframes.', 'mentor', 'MENTOR STORY', 'Esi Adjei', 'Paediatrics House Officer', 6, '2025-12-12', '7 min read', 'warm', 'INTERVIEWS', false, 'published', true),
  ('five-questions-before-a-course', 'Five questions to ask before you commit to a course.', 'The ones that would have saved a lot of people a lot of confusion — and the answers you should actually demand before signing anything.', 'The ones that would have saved a lot of people a lot of confusion — and the answers you should actually demand before signing anything.', 'guide', 'CAREER GUIDE', 'CA360 Team', 'CA360 Editorial', 7, '2025-11-28', '5 min read', 'orange', 'CAREER PREP', false, 'published', true)
on conflict (slug) do nothing;
