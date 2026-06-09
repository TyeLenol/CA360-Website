"use client";

import { ArrowRight } from '../shared/Icons';

const programs = [
  { n: '01', side: 'left',  tag: 'CORE · MONTHLY',
    title: 'Virtual sessions',
    desc: 'Live cohort calls with doctors, students and admissions officers, every six weeks. Bring your questions, walk out with a plan.',
    bullets: ['90-minute live calls', 'Open Q&A with mentors', 'Recordings stay free'] },
  { n: '02', side: 'right', tag: 'CORE · ROLLING',
    title: '1:1 mentorship matching',
    desc: 'Paired with a mentor who walked your exact path two or three years before you — same school, same field, similar starting point.',
    bullets: ['Hand-matched within 14 days', '3-month minimum', 'Voice notes, calls, WhatsApp'] },
  { n: '03', side: 'left',  tag: 'IN PERSON',
    title: 'School visits',
    desc: 'In-person sessions inside SHS classrooms and university lecture halls — by invitation from a teacher, dean, or student rep.',
    bullets: ['Half-day or full-day', 'Open to all forms', 'Free for partner schools'] },
  { n: '04', side: 'right', tag: 'OPEN ACCESS',
    title: 'Resource hub',
    desc: "Guides, recorded sessions and reading lists that stay free forever. Built from every session we've ever run.",
    bullets: ['Recorded session library', 'Field-specific reading lists', 'Application timelines'] },
];

export function Programs() {
  return (
    <section id="programs" className="programs-sec">
      <div className="programs-head">
        <div className="sec-eyebrow" data-reveal>04 — What we do</div>
        <h2 className="programs-title" data-reveal data-reveal-delay="1">
          Four ways mentorship<br /><em>actually</em> happens.
        </h2>
      </div>

      <div className="programs-track">
        <div className="programs-spine" aria-hidden="true" />

        {programs.map((p, i) => (
          <div
            key={p.n}
            className={'programs-row programs-row-' + p.side}
            data-reveal
          >
            <div className="programs-pin" aria-hidden="true">
              <span className="programs-pin-num">{p.n}</span>
            </div>

            <div className="programs-card">
              <span className="programs-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <ul className="programs-bullets">
                {p.bullets.map((b) => (
                  <li key={b}>
                    <span className="programs-bullet-tick" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l4 4L19 6" stroke="#d68307" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <a className="programs-more">
                Learn more <ArrowRight size={14} />
              </a>
            </div>

            {i < programs.length - 1 && (
              <svg className="programs-beeline" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
                {p.side === 'left' ? (
                  <path d="M 30 20 C 30 100, 370 120, 370 200" fill="none"
                        stroke="#d68307" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="3 12" />
                ) : (
                  <path d="M 370 20 C 370 100, 30 120, 30 200" fill="none"
                        stroke="#d68307" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="3 12" />
                )}
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
