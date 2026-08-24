'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, PlusIcon, MinusIcon, Star } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { useCountUp, useInView, usePrefersReducedMotion } from '../../hooks/ui-hooks';

/* ============================================================
   ABOUT — "Ask / Answer"
   A calm editorial contrast to the homepage, with one clear story:
   why CA360 exists, how the conversation works, where it shows up,
   and how a visitor can enter.
   ============================================================ */

const DIALOGUE = [
  { q: 'What do I even pick?',
    a: "You don't pick blind. You talk to someone already doing the job.",
    tag: 'OUR MISSION' },
  { q: 'Is it too late to change my mind?',
    a: "It's never too late — it's just unmapped. That's the part we fix.",
    tag: 'OUR VISION' },
  { q: 'Do I need connections to get in?',
    a: 'No. You need honest information, freely given — not a contact list.',
    tag: 'OUR VALUES' },
  { q: 'Why should I trust you?',
    a: 'Because we were you. CA360 was built by people who needed it first.',
    tag: 'OUR ORIGIN' },
];

const VALUES = [
  { t: 'We show up', d: 'Consistently. Sessions happen, mentors reply, promises hold.' },
  { t: 'Real talk only', d: 'No glossy brochures — the wins and the burnout, both.' },
  { t: 'Lived, not Googled', d: 'Guidance from people in the career, not a careers leaflet.' },
  { t: 'Free, always', d: 'Online and in person. Cost will never be the barrier.' },
];

const STATS = [
  { n: 2000, suffix: '+', label: 'Students reached', detail: 'Across SHS and undergrad, in person and online.' },
  { n: 12, suffix: '', label: 'Sessions hosted', detail: 'Ward walk-throughs, Q&As, and one-on-one matching.' },
  { n: 3, suffix: '', label: 'Universities', detail: 'Korle Bu, KNUST and UCC — and counting.' },
];

const TRACKS = [
  { t: 'Medicine', s: 'LIVE NOW', live: true },
  { t: 'Law', s: 'TRACK · 2026', live: false },
  { t: 'Engineering', s: 'COMING SOON', live: false },
  { t: 'Business', s: 'COMING SOON', live: false },
];

const TEAM = [
  { name: 'Dr. A. Asare', role: 'Founder · Medicine', seed: 1 },
  { name: 'Dr. K. Mensah', role: 'Surgery · KATH', seed: 2 },
  { name: 'Esi Adjei', role: 'Paediatrics H.O.', seed: 6 },
  { name: 'Akua Boateng', role: 'Alumna · Law', seed: 3 },
];

function AboutDialogue() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (reduced || hasInteracted) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % DIALOGUE.length), 4200);
    return () => clearInterval(id);
  }, [reduced, hasInteracted]);

  const chooseQuestion = (index) => {
    setHasInteracted(true);
    setActive(index);
  };

  const moveQuestion = (event, index) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = (index + delta + DIALOGUE.length) % DIALOGUE.length;
    chooseQuestion(next);
    document.getElementById(`ab-tab-${next}`)?.focus();
  };

  const current = DIALOGUE[active];

  return (
    <section className="ab-hero" id="about-top">
      <div className="ab-hero-head">
        <span className="sec-eyebrow" data-reveal>About · Career Arcadia 360</span>
        <h1 className="ab-hero-title" data-reveal data-reveal-delay="1">
          Mentorship,<br />as a <em>conversation</em>.
        </h1>
        <div className="ab-hero-intro" data-reveal data-reveal-delay="2">
          <p className="ab-hero-dek">
            Career conversations and practical mentorship for Ghanaian students figuring out what comes next.
          </p>
          <div className="ab-hero-utility">
            <span>FOR STUDENTS · MENTORS · PARTNERS</span>
            <a href="#about-loop" className="ab-hero-link">
              See how it works <ArrowRight color="currentColor" size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="ab-dialogue" data-reveal data-reveal-delay="3">
        <div className="ab-asks">
          <div className="ab-side-label">THE STUDENT ASKS</div>
          <div className="ab-ask-list" role="tablist" aria-label="Student questions">
            {DIALOGUE.map((d, i) => (
              <button
                type="button"
                key={d.q}
                id={`ab-tab-${i}`}
                className={'ab-ask' + (i === active ? ' is-active' : '')}
                role="tab"
                aria-selected={i === active}
                aria-controls="ab-answer-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => chooseQuestion(i)}
                onKeyDown={(event) => moveQuestion(event, i)}
              >
                <span className="ab-ask-mark" aria-hidden="true">{i === active ? '◆' : '◇'}</span>
                {d.q}
              </button>
            ))}
          </div>
        </div>

        <div className="ab-answer" role="tabpanel" id="ab-answer-panel" aria-labelledby={`ab-tab-${active}`} aria-live="polite">
          <div className="ab-side-label ab-side-label--right">THE MENTOR ANSWERS</div>
          <p className="ab-answer-text" key={active}>{current.a}</p>
          <div className="ab-answer-tag">{current.tag}</div>
        </div>
      </div>
    </section>
  );
}

function AboutLoop() {
  const steps = [
    ['Ask the real question', 'Course, career, confidence, or the thing you were too embarrassed to Google.'],
    ['Meet someone a step ahead', 'A mentor gives you the lived version — not a brochure or a perfect LinkedIn story.'],
    ['Leave with a next move', 'Not a life plan. Just a clearer decision and someone to ask when the next question arrives.'],
  ];

  return (
    <section className="ab-loop" id="about-loop" aria-labelledby="about-loop-title">
      <div className="ab-loop-intro" data-reveal>
        <div className="ab-tile-eyebrow">THE CA360 LOOP</div>
        <p>Good mentorship does not choose your future for you. It makes the next choice less lonely.</p>
      </div>
      <div className="ab-loop-main">
        <h2 id="about-loop-title" data-reveal data-reveal-delay="1">
          One question. One honest conversation. <em>A clearer next move.</em>
        </h2>
        <div className="ab-loop-steps">
          {steps.map(([title, body], i) => (
            <article className="ab-loop-step" key={title} data-reveal data-reveal-delay={String(i + 1)}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ value, i }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className={'ab-value' + (open ? ' is-open' : '')}
      data-reveal
      data-reveal-delay={(i % 3) + 1}
      onClick={() => setOpen((current) => !current)}
      aria-pressed={open}
    >
      <span className="ab-value-inner">
        <span className="ab-value-front">
          <span className="ab-value-title">{value.t}</span>
        </span>
        <span className="ab-value-back">{value.d}</span>
      </span>
    </button>
  );
}

function ImpactStat({ stat }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.4 });
  const n = useCountUp(stat.n, inView);
  const [open, setOpen] = useState(false);

  return (
    <div className="ab-stat" ref={ref}>
      <div className="ab-stat-num">{n.toLocaleString()}{stat.suffix}</div>
      <div className="ab-stat-row">
        <span className="ab-stat-label">{stat.label}</span>
        <button
          type="button"
          className="ab-stat-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? `Hide detail for ${stat.label}` : `Show detail for ${stat.label}`}
        >
          {open ? <MinusIcon size={14} color="#0a1f29" /> : <PlusIcon size={14} color="#0a1f29" />}
        </button>
      </div>
      {open && <p className="ab-stat-detail">{stat.detail}</p>}
    </div>
  );
}

function FounderTile() {
  const [open, setOpen] = useState(false);
  return (
    <article className="ab-tile ab-founder" data-reveal>
      <div className="ab-founder-head">
        <div className="ab-founder-avatar">
          <PhotoPlaceholder tone="warm" label="" style={{ width: '100%', height: '100%' }}>
            <Portrait seed={1} bg="transparent" tone="#d68307" />
          </PhotoPlaceholder>
        </div>
        <div>
          <div className="ab-tile-eyebrow">THEY ASK — WHY START THIS?</div>
          <h3 className="ab-founder-name">A letter from the founder</h3>
        </div>
      </div>
      <p className="ab-founder-lead">
        &ldquo;I got into medical school and realised I had no idea what I&apos;d
        actually signed up for. The students who did? They all had someone in the field.&rdquo;
      </p>
      {open && (
        <p className="ab-founder-more">
          CA360 is that someone — for everyone else. Too many students pick careers
          on pressure, popularity, or a vague picture of the job. We started in 2024 to
          change that, one honest conversation at a time, and we&apos;re only widening the door.
        </p>
      )}
      <button type="button" className="ab-readmore" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Read less' : 'Read the letter'}
        <span className="ab-readmore-arrow"><ArrowRight color="#fff" size={14} /></span>
      </button>
      <div className="ab-founder-attr">Dr. A. Asare · Founder &amp; Lead Mentor</div>
    </article>
  );
}

function StartTile() {
  return (
    <article className="ab-tile ab-start" data-reveal aria-labelledby="ab-start-title">
      <div className="ab-tile-eyebrow">THE FIRST DOOR</div>
      <div className="ab-start-mark" aria-hidden="true">?</div>
      <h3 id="ab-start-title">Before the title, start with the <em>question.</em></h3>
      <p>Not sure what to study or who to ask? Tell CA360 where the uncertainty sits and we will help you find a useful first conversation.</p>
      <div className="ab-start-actions">
        <a className="ab-start-link" href="/mentorship/find">Find a mentor <ArrowRight color="currentColor" size={14} /></a>
        <a className="ab-start-secondary" href="/mentorship">Browse the mentor index <ArrowRight color="currentColor" size={13} /></a>
      </div>
    </article>
  );
}

export function AboutPage() {
  return (
    <main className="about-page">
      <AboutDialogue />
      <AboutLoop />

      <section className="ab-bento" aria-label="About Career Arcadia 360">
        <article className="ab-tile ab-mission" data-reveal>
          <div className="ab-tile-eyebrow">THE SHORT VERSION</div>
          <h2 className="ab-mission-text">
            We bridge the gap between aspiring professionals and the{' '}
            <mark>knowledge</mark> they need to succeed — through honest mentorship,
            lived experience, and a community that <em>shows up</em>.
          </h2>
          <div className="ab-mission-meta">
            <span>SINCE 2024 · GHANA</span>
            <span>FREE TO ATTEND</span>
            <span>RUN BY YOUNG DOCTORS &amp; ALUMNI</span>
          </div>
        </article>

        <article className="ab-tile ab-vision" data-reveal data-reveal-delay="1">
          <div className="ab-tile-eyebrow">THE FUTURE WE&apos;RE BUILDING</div>
          <h3 className="ab-vision-head">A Ghana where no one picks a future <em>blind</em>.</h3>
          <ul className="ab-tracks">
            {TRACKS.map((t) => (
              <li key={t.t} className={'ab-track' + (t.live ? ' is-live' : '')}>
                <span className="ab-track-name">{t.t}</span>
                <span className="ab-track-state">{t.s}</span>
              </li>
            ))}
          </ul>
        </article>

        <div className="ab-tile ab-values">
          <div className="ab-tile-eyebrow">HOW WE SHOW UP <span aria-hidden="true">— flip a card</span></div>
          <div className="ab-values-grid">
            {VALUES.map((v, i) => <ValueCard key={v.t} value={v} i={i} />)}
          </div>
        </div>

        <article className="ab-tile ab-impact" data-reveal>
          <div className="ab-tile-eyebrow">THE PROOF <Star size={12} color="#d68307" /></div>
          <div className="ab-proof-note">Current programme snapshot</div>
          <div className="ab-impact-grid">
            {STATS.map((s) => <ImpactStat key={s.label} stat={s} />)}
          </div>
        </article>

        <FounderTile />
        <StartTile />

        <article className="ab-tile ab-team" data-reveal>
          <div className="ab-tile-eyebrow">THE PEOPLE BEHIND IT</div>
          <div className="ab-team-grid">
            {TEAM.map((m) => (
              <div className="ab-member" key={m.name}>
                <div className="ab-member-photo">
                  <PhotoPlaceholder tone="teal" label="" style={{ width: '100%', height: '100%' }}>
                    <Portrait seed={m.seed} bg="transparent" tone="#36728f" />
                  </PhotoPlaceholder>
                </div>
                <div className="ab-member-name">{m.name}</div>
                <div className="ab-member-role">{m.role}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="ab-tile ab-partners" data-reveal data-reveal-delay="1">
          <div className="ab-tile-eyebrow">WORK WITH US</div>
          <p className="ab-partners-text">Good mentorship travels further when a school, hospital, or sponsor helps open the door.</p>
          <ul className="ab-partner-list">
            <li>Host a student session</li>
            <li>Open a career track</li>
            <li>Support a cohort</li>
          </ul>
          <a className="ab-partners-link" href="/contact?type=partner">
            Start a partnership conversation <ArrowRight color="currentColor" size={14} />
          </a>
        </article>

        <article className="ab-tile ab-cta" data-reveal>
          <h3 className="ab-cta-head">Pick a way in.</h3>
          <div className="ab-cta-trio">
            <a className="ab-cta-card" href="/#join-students">
              <span className="ab-cta-label">Attend a session</span>
              <ArrowRight color="currentColor" size={16} />
            </a>
            <a className="ab-cta-card" href="/#join-mentors">
              <span className="ab-cta-label">Become a mentor</span>
              <ArrowRight color="currentColor" size={16} />
            </a>
            <a className="ab-cta-card" href="/contact?type=partner">
              <span className="ab-cta-label">Support or partner</span>
              <ArrowRight color="currentColor" size={16} />
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
