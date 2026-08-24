-- CA360 baseline content seed.
-- This mirrors the currently published placeholder/content roster; editorial copy remains in code until the client approves a CMS workflow.

insert into public.mentors (
  slug, name, role_label, positioning, path_summary, quote, field,
  status, is_public, accepting_requests, avatar_label
)
values
  (
    'dr-a-asare',
    'Dr. A. Asare',
    'Founder & Lead Mentor',
    'For the student who wants the honest version of medicine before choosing the next step.',
    'Founded CA360 after entering medical school and realising how different the lived reality was from what she had imagined. She built this work around a simple conviction: the students with family in a field should not be the only ones who get to know the truth early.',
    'No one should have to figure it out blindly. That is not ambition — that is luck. And luck is not a strategy.',
    'Medicine',
    'active', true, true, 'MENTOR · MEDICINE'
  ),
  (
    'dr-k-mensah',
    'Dr. K. Mensah',
    'Surgery Resident · KATH',
    'For questions about specialised medical paths, discipline, and what the long road actually asks of you.',
    'A second-year surgical resident at Komfo Anokye Teaching Hospital. He joined CA360 to share the parts of a specialised path that are rarely visible from the outside — including the turns, trade-offs, and questions that arrive before confidence does.',
    'Surgery was not a straight line for me — and that is the most useful thing I tell my mentees.',
    'Medicine',
    'active', true, true, 'MENTOR · SURGERY'
  ),
  (
    'akua-boateng',
    'Akua Boateng',
    'Final-year Law · UG',
    'For the student learning to trust their voice, make an argument, and imagine law beyond the title.',
    'A final-year law student at the University of Ghana and captain of the UG debate team. She is part of the early circle helping CA360 understand what a thoughtful Law track should make possible for students.',
    'Build a voice first. The CV catches up faster than people think.',
    'Law',
    'active', true, true, 'MENTOR · LAW'
  ),
  (
    'joel-owusu',
    'Joel Owusu',
    'Mechanical Engineering · KNUST → Siemens',
    'For the student who wants the human side of engineering: decisions, teamwork, and the questions behind the maths.',
    'A KNUST mechanical engineering graduate now on a graduate scheme in Accra. He joined as an early mentor while CA360 maps what an Engineering track can look like when students meet the person behind the job title.',
    'The job is half the maths. The other half is asking better questions in meetings.',
    'Engineering',
    'active', true, true, 'MENTOR · ENGINEERING'
  ),
  (
    'esi-adjei',
    'Esi Adjei',
    'Paediatrics House Officer',
    'For students curious about child health, public health, and the parts of care that stay human under pressure.',
    'A house officer in paediatrics at Korle Bu. She brings a grounded view of child health, public health pathways, and the reality of learning while the work keeps moving around you.',
    'You do not have to know your sub-specialty at 17. Most of us still do not.',
    'Medicine',
    'active', true, true, 'MENTOR · PAEDIATRICS'
  )
on conflict (slug) do update set
  name = excluded.name,
  role_label = excluded.role_label,
  positioning = excluded.positioning,
  path_summary = excluded.path_summary,
  quote = excluded.quote,
  field = excluded.field,
  status = excluded.status,
  is_public = excluded.is_public,
  accepting_requests = excluded.accepting_requests,
  avatar_label = excluded.avatar_label,
  updated_at = timezone('utc', now());

insert into public.mentor_specialties (mentor_id, specialty)
select m.id, x.specialty
from public.mentors m
join (
  values
    ('dr-a-asare', 'Medicine'),
    ('dr-a-asare', 'Medical school pathways'),
    ('dr-k-mensah', 'Surgery'),
    ('dr-k-mensah', 'Specialised medical pathways'),
    ('akua-boateng', 'Law'),
    ('akua-boateng', 'Debate and advocacy'),
    ('joel-owusu', 'Mechanical engineering'),
    ('joel-owusu', 'Early career engineering'),
    ('esi-adjei', 'Paediatrics'),
    ('esi-adjei', 'Public health')
) as x(slug, specialty) on x.slug = m.slug
on conflict (mentor_id, specialty) do nothing;

insert into public.sessions (
  slug, title, summary, field, format, venue, category,
  duration_minutes, attendee_count, status, is_public
)
values
  (
    'session-05',
    'What your career actually looks like — from people living it.',
    'Professionals across three fields broke down what their first year post-university really looked like — the unexpected parts, the things nobody tells you.',
    'Career paths',
    'in_person',
    'University of Ghana · Legon',
    'CAREER TALK',
    90, 78, 'completed', true
  ),
  (
    'session-04',
    'Career conversations for SHS-3 students — before the pressure decides for you.',
    'An in-person career talk for final-year students navigating choices before WASSCE results. Real voices, no scripts.',
    'Admissions',
    'in_person',
    'Wesley Girls'' SHS · Cape Coast',
    'SCHOOLS OUTREACH',
    120, 62, 'completed', true
  ),
  (
    'session-03',
    'There is no one path — navigating multiple directions at once.',
    'Professionals who pivoted, combined fields, or carved their own routes — on building a career that fits you, not just a CV.',
    'Career paths',
    'in_person',
    'KNUST · Kumasi',
    'CAREER PATHS',
    90, 54, 'completed', true
  ),
  (
    'session-02',
    'Getting in — navigating tertiary applications across Ghana.',
    'KNUST, UG, UCC and beyond: deadlines, requirements, interviews and the decisions that quietly determine where you end up.',
    'Admissions',
    'online',
    'Online · open cohort',
    'ADMISSIONS',
    60, 64, 'completed', true
  ),
  (
    'session-01',
    'Why we built this — the first CA360 session, ever.',
    'A founders-only conversation: what we wished someone had told us at 17, and what we promised this org would never become.',
    'CA360',
    'online',
    'Online · friends and family',
    'KICKOFF',
    60, 42, 'completed', true
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  field = excluded.field,
  format = excluded.format,
  venue = excluded.venue,
  category = excluded.category,
  duration_minutes = excluded.duration_minutes,
  attendee_count = excluded.attendee_count,
  status = excluded.status,
  is_public = excluded.is_public,
  updated_at = timezone('utc', now());
