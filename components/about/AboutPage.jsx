"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, PlusIcon, MinusIcon, PinIcon, Star } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { useCountUp, useInView, usePrefersReducedMotion } from '../../hooks/ui-hooks';

/* ============================================================
   ABOUT — "Ask / Answer"
   Mentorship dialogue (signature moment) + modular bento grid.
   Every brand statement is the answer to a real student question.
   ============================================================ */

/* ===== DATA ===== */
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

const PLACES = [
  { name: 'Korle Bu', x: 30, y: 78 },
  { name: 'KNUST · Kumasi', x: 42, y: 50 },
  { name: 'UCC · Cape Coast', x: 26, y: 88 },
];

const TEAM = [
  { name: 'Dr. A. Asare', role: 'Founder · Medicine', seed: 1 },
  { name: 'Dr. K. Mensah', role: 'Surgery · KATH', seed: 2 },
  { name: 'Esi Adjei', role: 'Paediatrics H.O.', seed: 6 },
  { name: 'Akua Boateng', role: 'Alumna · Law', seed: 3 },
];

/* ===== SIGNATURE: DIALOGUE HERO ===== */
function AboutDialogue() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  // Auto-cycle the exchange — paused entirely when reduced motion is requested.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((i) => (i + 1) % DIALOGUE.length), 4200);
    return () => clearInterval(id);
  }, [reduced]);

  const current = DIALOGUE[active];

  return (
    <section className="ab-hero" id="about-top">
      <div className="ab-hero-head">
        <span className="sec-eyebrow" data-reveal>About · Career Arcadia 360</span>
        <h1 className="ab-hero-title" data-reveal data-reveal-delay="1">
          Mentorship,<br />as a <em>conversation</em>.
        </h1>
      </div>

      <div className="ab-dialogue" data-reveal data-reveal-delay="2">
        {/* LEFT — the student asks */}
        <div className="ab-asks">
          <div className="ab-side-label">THE STUDENT ASKS</div>
          <ul className="ab-ask-list" role="tablist" aria-label="Student questions">
            {DIALOGUE.map((d, i) => (
              <li key={d.q}>
                <button
                  id={`ab-tab-${i}`}
                  className={'ab-ask' + (i === active ? ' is-active' : '')}
                  role="tab"
                  aria-selected={i === active}
                  aria-controls="ab-answer-panel"
                  onClick={() => setActive(i)}
                >
                  <span className="ab-ask-mark" aria-hidden="true">{i === active ? '◆' : '◇'}</span>
                  {d.q}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — the mentor answers (the kinetic moment) */}
        <div className="ab-answer" role="tabpanel" id="ab-answer-panel"
             aria-labelledby={`ab-tab-${active}`} aria-live="polite">
          <div className="ab-side-label ab-side-label--right">THE MENTOR ANSWERS</div>
          {/* key forces a remount so the crossfade replays on change */}
          <p className="ab-answer-text" key={active}>{current.a}</p>
          <div className="ab-answer-tag">{current.tag}</div>
        </div>
      </div>
    </section>
  );
}

/* ===== VALUE FLIP CARD ===== */
function ValueCard({ value, i }) {
  return (
    <button className="ab-value" data-reveal data-reveal-delay={(i % 3) + 1}>
      <span className="ab-value-inner">
        <span className="ab-value-front">
          <span className="ab-value-num">0{i + 1}</span>
          <span className="ab-value-title">{value.t}</span>
        </span>
        <span className="ab-value-back">{value.d}</span>
      </span>
    </button>
  );
}

/* ===== IMPACT STAT (count-up + expandable detail) ===== */
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

/* ===== FOUNDER (expandable letter) ===== */
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
      <button className="ab-readmore" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Read less' : 'Read the letter'}
        <span className="ab-readmore-arrow"><ArrowRight color="#fff" size={14} /></span>
      </button>
      <div className="ab-founder-attr">Dr. A. Asare · Founder &amp; Lead Mentor</div>
    </article>
  );
}

/* ===== MAP OF GHANA (static, hover reveals places) ===== */
function MapTile() {
  return (
    <article className="ab-tile ab-map" data-reveal>
      <div className="ab-tile-eyebrow">WHERE WE&apos;VE SHOWN UP</div>
      <div className="ab-map-stage">
        <svg viewBox="0 0 100 110" className="ab-map-svg" aria-hidden="true">
          {/* stylised Ghana silhouette */}
          <path
            d="M18 14 L70 12 L74 30 L66 44 L70 64 L58 96 L46 104 L40 96 L34 98 L30 84 L20 70 L24 50 L16 34 Z"
            fill="rgba(254,249,238,0.06)" stroke="rgba(254,249,238,0.4)" strokeWidth="1.2"
          />
          {PLACES.map((p) => (
            <circle key={p.name} cx={p.x} cy={p.y} r="2.6" fill="#d68307" />
          ))}
        </svg>
        <ul className="ab-map-pins">
          {PLACES.map((p) => (
            <li key={p.name} className="ab-map-pin" style={{ left: `${p.x}%`, top: `${p.y / 1.1}%` }}>
              <PinIcon size={16} color="#d68307" />
              <span className="ab-map-name">{p.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ===== PAGE ROOT ===== */
export function AboutPage() {
  return (
    <main className="about-page">
      <AboutDialogue />

      <section className="ab-bento" aria-label="About Career Arcadia 360">
        {/* MISSION — large */}
        <article className="ab-tile ab-mission" data-reveal>
          <div className="ab-tile-eyebrow">THEY ASK — WHAT DO YOU ACTUALLY DO?</div>
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

        {/* VISION */}
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

        {/* VALUES — flip cards */}
        <div className="ab-tile ab-values">
          <div className="ab-tile-eyebrow">HOW WE SHOW UP <span aria-hidden="true">— flip a card</span></div>
          <div className="ab-values-grid">
            {VALUES.map((v, i) => <ValueCard key={v.t} value={v} i={i} />)}
          </div>
        </div>

        {/* IMPACT */}
        <article className="ab-tile ab-impact" data-reveal>
          <div className="ab-tile-eyebrow">THE PROOF <Star size={12} color="#d68307" /></div>
          <div className="ab-impact-grid">
            {STATS.map((s) => <ImpactStat key={s.label} stat={s} />)}
          </div>
        </article>

        {/* FOUNDER */}
        <FounderTile />

        {/* MAP */}
        <MapTile />

        {/* TEAM */}
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

        {/* PARTNERS — coming soon */}
        <article className="ab-tile ab-partners" data-reveal data-reveal-delay="1">
          <div className="ab-tile-eyebrow">PARTNERS</div>
          <p className="ab-partners-text">Schools, hospitals and sponsors — <em>coming soon</em>.</p>
          <a className="ab-partners-link" href="/#contact">
            Partner with us <ArrowRight color="currentColor" size={14} />
          </a>
        </article>

        {/* CTA TRIO */}
        <article className="ab-tile ab-cta" data-reveal>
          <h3 className="ab-cta-head">Pick a way in.</h3>
          <div className="ab-cta-trio">
            <a className="ab-cta-card" href="/#join">
              <span className="ab-cta-num">01</span>
              <span className="ab-cta-label">Attend a session</span>
              <ArrowRight color="currentColor" size={16} />
            </a>
            <a className="ab-cta-card" href="/#join">
              <span className="ab-cta-num">02</span>
              <span className="ab-cta-label">Become a mentor</span>
              <ArrowRight color="currentColor" size={16} />
            </a>
            <a className="ab-cta-card" href="/#contact">
              <span className="ab-cta-num">03</span>
              <span className="ab-cta-label">Support the mission</span>
              <ArrowRight color="currentColor" size={16} />
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
