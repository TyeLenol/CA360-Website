"use client";

import { ArrowRight } from '../shared/Icons';

const programs = [
  { side: 'left',  tag: 'VIRTUAL · CAREER-BASED',
    title: 'Virtual programmes',
    desc: 'Live career sessions with professionals, alumni and industry guests. Bring your questions, walk out with a plan.',
    bullets: ['90-minute live career sessions', 'Open Q&A with working professionals', 'Recordings shared with registered members'],
    href: '#sessions', cta: 'See upcoming sessions' },
  { side: 'right', tag: 'IN PERSON · SCHOOLS',
    title: 'Schools outreach',
    desc: 'In-person career talks in various high schools — by invitation from head teachers and school counsellors.',
    bullets: ['Open to all year groups', 'Free for partner institutions'],
    href: 'mailto:hello@careerarcadia360.org?subject=School%20outreach%20partnership', cta: 'Ask about school visits' },
  { side: 'left',  tag: 'COMING SOON',
    title: '1:1 mentorship',
    desc: 'Personalised matching with a mentor who has walked a similar path — same field, similar background, a few years ahead of you.',
    bullets: ['Hand-matched to your goals', 'Structured 3-month programme', 'Currently under development'],
    href: '#news', cta: 'Get launch updates' },
];

export function Programs() {
  return (
    <section id="programs" className="programs-sec">
      <div className="programs-head">
        <div className="sec-eyebrow" data-reveal>What we do</div>
        <h2 className="programs-title" data-reveal data-reveal-delay="1">
          Three ways mentorship<br /><em>actually</em> happens.
        </h2>
      </div>

      <div className="programs-track">
        <div className="programs-spine" aria-hidden="true" />

        {programs.map((p, i) => (
          <div
            key={p.title}
            className={'programs-row programs-row-' + p.side}
            data-reveal
          >
            <div className="programs-pin" aria-hidden="true" />

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
              <a className="programs-more" href={p.href}>
                {p.cta} <ArrowRight size={14} />
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
