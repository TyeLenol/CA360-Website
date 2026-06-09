"use client";

import { useRef } from 'react';
import { ArrowRight } from '../shared/Icons';
import { PhotoPlaceholder } from '../shared/Placeholders';
import { useScrollProgress } from '../../hooks/ui-hooks';

const JOIN_PANELS = [
  {
    n: '01', tag: 'FOR STUDENTS',
    title: 'Attend a session.', titleEm: 'session',
    body: "Free, online or on your campus. Bring a friend, bring a question, leave with a plan that actually fits your life — not someone else's.",
    bullets: ['Free for all SHS and undergrad students', 'Online and in-person formats', 'Recordings stay free forever'],
    cta: 'Reserve a seat',
    bg: 'rgba(214, 131, 7, 1)', fg: '#fff',
    photoTone: 'teal', photoLabel: 'STUDENTS · SESSION 04',
  },
  {
    n: '02', tag: 'FOR PROFESSIONALS',
    title: 'Become a mentor.', titleEm: 'mentor',
    body: 'If you walked the path — medicine, law, engineering, business — share it with someone behind you. We match you with a student who started where you did.',
    bullets: ['3-month rolling commitment', 'Hand-matched within 14 days', 'Async or live, your call'],
    cta: 'Apply to mentor',
    bg: 'rgba(54, 114, 143, 1)', fg: '#fff',
    photoTone: 'warm', photoLabel: 'MENTOR · WHITEBOARD',
  },
  {
    n: '03', tag: 'FOR PARTNERS',
    title: 'Support the mission.', titleEm: 'mission',
    body: "Sponsor a session, partner with us as a school, or fund a cohort that wouldn't happen otherwise. Every cedi turns into a seat — guaranteed.",
    bullets: ['School and university partnerships', 'Per-session sponsorship', 'Annual cohort funding'],
    cta: 'Partner with us',
    bg: 'rgba(10, 31, 41, 1)', fg: '#fff',
    photoTone: 'deep', photoLabel: 'PARTNER · HANDSHAKE',
  },
];

export function JoinIn() {
  const wrapRef = useRef(null);
  const progress = useScrollProgress(wrapRef);

  const PANEL_COUNT = JOIN_PANELS.length;
  const t = progress * PANEL_COUNT;
  const active = Math.min(PANEL_COUNT - 1, Math.floor(t));

  const fallState = (startT, endT) => {
    const raw = Math.max(0, Math.min(1, (t - startT) / (endT - startT)));
    const eased = 1 - Math.pow(1 - raw, 3);
    const wobble = raw > 0.85 ? Math.sin((raw - 0.85) * Math.PI * 6.6) * (1 - raw) * 8 : 0;
    return { raw, eased, wobble };
  };

  return (
    <section id="join" className="join-sec" ref={wrapRef}>
      <div className="join-pin">
        <div className="join-stage">
          {JOIN_PANELS.map((p, i) => {
            const fadeProgress = Math.max(0, Math.min(1, (t - i) / 0.4));
            const outProgress = i < PANEL_COUNT - 1 ? Math.max(0, Math.min(1, (t - (i + 1)) / 0.4)) : 0;
            const opacity = fadeProgress * (1 - outProgress);

            return (
              <div
                key={'bg-' + p.n}
                className="join-big-bg"
                style={{
                  opacity,
                  background: p.bg,
                  pointerEvents: Math.round(opacity) === 1 ? 'auto' : 'none',
                }}
                aria-hidden={opacity < 0.5}
              >
                <div className="join-big-photo-wrap">
                  <PhotoPlaceholder tone={p.photoTone} label={p.photoLabel} style={{ width: '100%', height: '100%' }} />
                  <span className="join-panel-deco" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="join-stack">
          {JOIN_PANELS.map((p, i) => {
            const { raw, eased, wobble } = fallState(i, i + 0.5);
            const fromY = -800;
            const toY = i * 14;
            const y = fromY + eased * (toY - fromY);
            const baseRot = i === 0 ? -1.5 : (i === 1 ? 2.5 : -2);
            const r = eased * baseRot + wobble;
            const op = raw > 0.02 ? 1 : 0;

            return (
              <article
                key={p.n}
                className="join-small-card"
                style={{
                  transform: `translateY(${y}px) rotate(${r}deg)`,
                  opacity: op,
                  zIndex: 10 + i,
                  color: p.bg,
                }}
              >
                <div className="join-panel-num-small">{p.n}</div>
                <div className="join-panel-tag-small">{p.tag}</div>
                <h3 className="join-panel-title-small">
                  {p.title.split(p.titleEm)[0]}<em>{p.titleEm}</em>{p.title.split(p.titleEm)[1]}
                </h3>
                <p className="join-panel-body-small">{p.body}</p>
                <ul className="join-panel-bullets-small">
                  {p.bullets.map((b) => (
                    <li key={b}>
                      <span className="join-panel-tick-small">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <a className="join-panel-cta-small" style={{ background: p.bg, color: '#fff' }}>
                  {p.cta} <ArrowRight color="#fff" size={16} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="join-rail" aria-hidden="true">
          <div className="join-rail-label">JOIN IN · 26</div>
          <div className="join-rail-steps">
            {JOIN_PANELS.map((p, i) => (
              <div
                key={p.n}
                className={'join-rail-step'
                  + (i === active ? ' is-active' : '')
                  + (i < active ? ' is-done' : '')}
              >
                <span className="join-rail-num">{p.n}</span>
                <span className="join-rail-name">{p.tag.replace('FOR ', '')}</span>
              </div>
            ))}
          </div>
          <div className="join-rail-progress">
            <div className="join-rail-progress-bar" style={{ width: (progress * 100) + '%' }} />
          </div>
        </div>

        <div className="join-overlay-head">
          <div className="sec-eyebrow" style={{ color: '#fff' }}>09 — Get involved</div>
          <h2 className="join-overlay-title">
            Three ways to <em>show up</em>.
          </h2>
        </div>
      </div>
    </section>
  );
}
