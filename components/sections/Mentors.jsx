"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { useInView } from '../../hooks/ui-hooks';

const MENTORS = [
  { id: 'm1', name: 'Dr. A. Asare',  field: 'Medicine',    tone: 'warm',
    role: 'Founder & Lead Mentor',
    bio: 'House officer at Korle Bu Teaching Hospital. UGMS alum, class of 2022. Started CA360 in 2024 after one too many SHS-3 students asked her, "what does med school actually feel like?"',
    quote: 'Ask the hard questions early. The wrong question is the one you swallow.',
    stats: [['Years', '4+'], ['Mentees', '47'], ['Sessions led', '5']],
    tag: 'LEAD MENTOR', seed: 1 },
  { id: 'm2', name: 'Dr. K. Mensah', field: 'Medicine',    tone: 'teal',
    role: 'Surgery Resident · KATH',
    bio: "Second-year surgical resident at Komfo Anokye Teaching Hospital. Joined CA360 to mentor SHS students considering specialised tracks — and to keep his bedside teaching sharp.",
    quote: "Surgery wasn't a straight line for me — and that's the most useful thing I tell my mentees.",
    stats: [['Years', '6+'], ['Mentees', '18'], ['Sessions led', '2']],
    tag: 'ACTIVE', seed: 2 },
  { id: 'm3', name: 'Akua Boateng',  field: 'Law',         tone: 'orange',
    role: 'Final-year Law · UG',
    bio: 'Final-year law student at the University of Ghana and captain of the UG debate team. Guest mentor as we prepare to open the Law track in Q2 2026.',
    quote: 'Build a voice first. The CV catches up faster than people think.',
    stats: [['Year', '4'], ['Mentees', '6'], ['Sessions led', '1']],
    tag: 'GUEST MENTOR', seed: 3 },
  { id: 'm4', name: 'Joel Owusu',    field: 'Engineering', tone: 'deep',
    role: 'Mech Eng · KNUST → Siemens',
    bio: 'KNUST mechanical engineering graduate, now on the Siemens graduate scheme in Accra. Joined as a guest mentor to start mapping the Engineering track.',
    quote: 'The job is half the maths. The other half is asking better questions in meetings.',
    stats: [['Years', '3'], ['Mentees', '4'], ['Sessions led', '0']],
    tag: 'GUEST MENTOR', seed: 4 },
  { id: 'm5', name: 'Esi Adjei',     field: 'Medicine',    tone: 'soft',
    role: 'Paediatrics House Officer',
    bio: "House officer in paediatrics at Korle Bu. Mentors SHS students interested in child health, public health pathways, and the realities of housemanship.",
    quote: "You don't have to know your sub-specialty at 17. Most of us still don't.",
    stats: [['Years', '3'], ['Mentees', '12'], ['Sessions led', '1']],
    tag: 'ACTIVE', seed: 6 },
];

export function Mentors() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { threshold: 0.25, once: false });

  useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % MENTORS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, inView]);

  const prev = () => setActive((i) => (i - 1 + MENTORS.length) % MENTORS.length);
  const next = () => setActive((i) => (i + 1) % MENTORS.length);
  const m = MENTORS[active];

  return (
    <section
      id="mentors"
      className="mentors-sec"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mentors-head">
        <div className="sec-eyebrow" data-reveal>06 — The people behind the guidance</div>
        <h2 className="mentors-title" data-reveal data-reveal-delay="1">
          Mentors who&apos;ve<br />walked your <em>exact</em> path.
        </h2>
        <a className="mentors-all" data-reveal data-reveal-delay="2">
          All mentors <ArrowRight size={14} />
        </a>
      </div>

      <div className="mentors-stage" data-reveal data-reveal-delay="2">
        <article className="mentors-feature" key={m.id}>
          <div className="mentors-feature-photo">
            <PhotoPlaceholder tone={m.tone} label={'MENTOR · ' + m.field.toUpperCase()} style={{ width: '100%', height: '100%' }}>
              <Portrait seed={m.seed} bg="transparent" tone="#d68307" />
            </PhotoPlaceholder>
            <span className="mentors-feature-tag">{m.tag}</span>
            <span className="mentors-feature-idx">№ 0{active + 1} / 0{MENTORS.length}</span>
          </div>

          <div className="mentors-feature-body">
            <div className="mentors-feature-field">{m.field.toUpperCase()} · {m.role.toUpperCase()}</div>
            <h3 className="mentors-feature-name">{m.name}</h3>
            <p className="mentors-feature-bio">{m.bio}</p>

            <div className="mentors-feature-quote">
              <span className="mentors-feature-quote-mark">&ldquo;</span>
              {m.quote}
            </div>

            <div className="mentors-feature-stats">
              {m.stats.map(([k, v]) => (
                <div key={k}>
                  <div className="mentors-feature-stat-v">{v}</div>
                  <div className="mentors-feature-stat-k">{k}</div>
                </div>
              ))}
            </div>

            <div className="mentors-feature-controls">
              <button className="mentors-arrow" onClick={prev} aria-label="Previous mentor">
                <ArrowLeft size={16} color="#fff" />
              </button>
              <div className="mentors-progress" aria-hidden="true">
                <div
                  className={'mentors-progress-bar' + (paused || !inView ? ' is-paused' : '')}
                  key={'p-' + active + '-' + paused + '-' + inView}
                />
              </div>
              <button className="mentors-arrow mentors-arrow-next" onClick={next} aria-label="Next mentor">
                <ArrowRight size={16} color="#fff" />
              </button>
            </div>
          </div>
        </article>

        <aside className="mentors-rail">
          <div className="mentors-rail-head">
            <div className="mentors-rail-lab">ROSTER · {MENTORS.length} ACTIVE</div>
            <div className="mentors-rail-hint">
              Tap a portrait
              <svg width="32" height="14" viewBox="0 0 40 14" fill="none">
                <path d="M2 8 C 12 2, 22 14, 38 4" stroke="#d68307" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 2 L 38 4 L 36 10" stroke="#d68307" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
          </div>

          <ul className="mentors-rail-list">
            {MENTORS.map((mm, i) => (
              <li
                key={mm.id}
                className={'mentors-rail-item' + (i === active ? ' is-active' : '')}
              >
                <button
                  className="mentors-avatar"
                  onClick={() => setActive(i)}
                  aria-label={'Select ' + mm.name}
                >
                  <PhotoPlaceholder tone={mm.tone} label="" style={{ width: '100%', height: '100%' }}>
                    <Portrait seed={mm.seed} bg="transparent" tone="#d68307" />
                  </PhotoPlaceholder>
                  {i === active && <span className="mentors-avatar-ring" />}
                </button>
                <div className="mentors-rail-meta">
                  <div className="mentors-rail-name">{mm.name}</div>
                  <div className="mentors-rail-field">{mm.field}</div>
                </div>
              </li>
            ))}
          </ul>

          <a className="mentors-join">
            Become a mentor <ArrowRight size={14} color="#0a1f29" />
          </a>
        </aside>
      </div>
    </section>
  );
}
