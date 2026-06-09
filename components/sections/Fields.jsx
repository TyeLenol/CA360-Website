"use client";

import { ArrowRight } from '../shared/Icons';

const bulletins = [
  { id: 'b1', tag: 'COHORT 06 · OPEN NOW', date: 'JUN 2026',
    headline: 'Virtual career sessions — registration now open for the next cohort.',
    sub: 'Live 90-minute sessions with working professionals. Open to SHS and university students across Ghana.' },
  { id: 'b2', tag: 'SCHOOLS OUTREACH', date: 'MAY 2026',
    headline: 'Five new partner schools onboarded across Accra, Kumasi and Cape Coast.',
    sub: 'In-person career talks are back in classrooms. Schools can apply to be a partner institution.' },
  { id: 'b3', tag: '1:1 MENTORSHIP', date: 'APR 2026',
    headline: '1:1 mentorship programme in development — expressions of interest now open.',
    sub: 'Personalised mentoring matched to your field and goals. Coming soon to early applicants.' },
  { id: 'b4', tag: 'COMMUNITY', date: 'MAR 2026',
    headline: '300+ community members and growing — thank you for being part of this.',
    sub: 'From our first session of 42 students to a community that keeps showing up and sending others our way.' },
];

export function Fields() {
  return (
    <section id="fields" className="fields-sec">
      <div className="fields-head">
        <div className="sec-eyebrow" data-reveal>03 — What&apos;s happening</div>
        <h2 className="fields-title" data-reveal data-reveal-delay="1">
          Latest from <em>CA360</em>.
        </h2>
        <p className="fields-note" data-reveal data-reveal-delay="2">
          Updates from our sessions, programmes and community — as they happen.
        </p>
      </div>

      <div className="fields-bulletin" data-reveal data-reveal-delay="3">
        {bulletins.map((b) => (
          <a
            key={b.id}
            href="#"
            className="fields-bulletin-item"
          >
            <div className="fields-bulletin-meta">
              <span className="fields-bulletin-tag">{b.tag}</span>
              <span className="fields-bulletin-date">{b.date}</span>
            </div>
            <div className="fields-bulletin-body">
              <h3 className="fields-bulletin-headline">{b.headline}</h3>
              <p className="fields-bulletin-sub">{b.sub}</p>
            </div>
            <span className="fields-bulletin-arrow">
              <ArrowRight size={16} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
