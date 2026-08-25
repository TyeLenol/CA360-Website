"use client";

import { ArrowRight, Star } from '../shared/Icons';

const FALLBACK_PATHS = [
  { label: 'STUDENT', title: 'I want clarity', href: '#news' },
  { label: 'MENTOR', title: 'I want to guide', href: 'mailto:hello@careerarcadia360.org?subject=Mentor%20application' },
  { label: 'PARTNER', title: 'I want to help', href: 'mailto:hello@careerarcadia360.org?subject=Partnership%20inquiry' },
];

function OpportunityTitle({ value }) {
  const title = value || 'Cohort 06 is open.';
  const match = title.match(/^(.*?\bis\s)(.+)$/i);
  if (!match) return <>{title}</>;
  return <>{match[1]}<em>{match[2]}</em></>;
}

export function CurrentOpportunity({ content }) {
  const copy = content || {};
  const paths = Array.isArray(copy.paths) && copy.paths.length ? copy.paths : FALLBACK_PATHS;
  return (
    <section id="opportunity" className="opportunity-sec" aria-labelledby="opportunity-title">
      <div className="opportunity-grid-mark" aria-hidden="true" />

      <div className="opportunity-head">
        <div className="sec-eyebrow">{copy.eyebrow || 'Right now at CA360'}</div>
        <div className="opportunity-stamp">
          <Star size={11} color="#0a1f29" />
          LIVE SIGNAL
        </div>
      </div>

      <div className="opportunity-layout">
        <div className="opportunity-main">
          <div className="opportunity-kicker">
            <span className="opportunity-pulse" aria-hidden="true" />
            CURRENT OPPORTUNITY
          </div>
          <h2 id="opportunity-title"><OpportunityTitle value={copy.title} /></h2>
          <p>{copy.body || 'Start with the next honest conversation about what comes after SHS — then stay close as new fields, sessions and mentors open up.'}</p>
          <div className="opportunity-actions">
            <a className="btn btn-primary" href={copy.primary_href || '#news'}>
              {copy.primary_label || 'Get cohort updates'} <ArrowRight color="#0a1f29" size={14} />
            </a>
            <a className="opportunity-link" href={copy.secondary_href || '#programs'}>
              {copy.secondary_label || 'See how it works'} <ArrowRight color="#fff" size={14} />
            </a>
          </div>
        </div>

        <div className="opportunity-signpost" aria-label="CA360 proof points">
          <span className="opportunity-signpost-label">THE SHORT VERSION</span>
          <div className="opportunity-signpost-status">
            <span className="opportunity-status-dot" aria-hidden="true" />
            {copy.status_label || 'COHORT OPEN'}
          </div>
          <div className="opportunity-signpost-rule" />
          <div className="opportunity-signpost-meta">
            <span>{copy.metric_one_value || '2K+'}</span>
            <small>{copy.metric_one_label || 'STUDENTS REACHED'}</small>
          </div>
          <div className="opportunity-signpost-meta">
            <span>{copy.metric_two_value || '9/10'}</span>
            <small>{copy.metric_two_label || 'AVG SESSION RATING'}</small>
          </div>
        </div>
      </div>

      <div className="opportunity-paths" aria-label="Choose your path">
        {paths.map((path) => (
          <a className="opportunity-path" key={path.label} href={path.href}>
            <span className="opportunity-path-label">{path.label}</span>
            <span className="opportunity-path-title">{path.title}</span>
            <ArrowRight size={15} />
          </a>
        ))}
      </div>
    </section>
  );
}
