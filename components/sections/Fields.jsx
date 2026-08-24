"use client";

import { ArrowRight } from '../shared/Icons';

const bulletins = [
  { id: 'b1', tag: 'CURRENT COHORT', date: 'COHORT 06',
    headline: 'Beyond the Classroom — Inside Tech Careers.',
    sub: 'A live career session with professionals sharing what working in tech and beyond actually looks like, day to day.', href: '#opportunity' },
  { id: 'b2', tag: 'SCHOOLS OUTREACH', date: 'JUN 2026',
    headline: 'School outreach to Eguafo SHS, Holy Child SHS and St Augustine\'s SHS.',
    sub: 'In-person career talks brought directly to students across three secondary schools in Ghana.', href: '/journal#journal-grid' },
  { id: 'b3', tag: '1:1 MENTORSHIP', date: 'APR 2026',
    headline: '1:1 mentorship programme — currently under development.',
    sub: 'Personalised mentoring matched to your field and goals. Launching soon.', href: '#news' },
  { id: 'b4', tag: 'COMMUNITY', date: 'MAR 2024',
    headline: '400+ community members and growing — thank you for being part of this.',
    sub: 'From our first session of 42 students to a community that keeps showing up and sending others our way.', href: '/journal#journal-grid' },
];

export function Fields() {
  return (
    <section id="fields" className="fields-sec">
      <div className="fields-head">
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
            href={b.href || '/journal#journal-grid'}
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
