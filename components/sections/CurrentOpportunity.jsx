"use client";

import { ArrowRight, Star } from '../shared/Icons';

const PATHS = [
  { label: 'STUDENT', title: 'I want clarity', href: '#news' },
  { label: 'MENTOR', title: 'I want to guide', href: 'mailto:hello@careerarcadia360.org?subject=Mentor%20application' },
  { label: 'PARTNER', title: 'I want to help', href: 'mailto:hello@careerarcadia360.org?subject=Partnership%20inquiry' },
];

export function CurrentOpportunity() {
  return (
    <section id="opportunity" className="opportunity-sec" aria-labelledby="opportunity-title">
      <div className="opportunity-grid-mark" aria-hidden="true" />

      <div className="opportunity-head">
        <div className="sec-eyebrow">Right now at CA360</div>
        <div className="opportunity-stamp">
          <Star size={11} color="#fff" />
          LIVE SIGNAL · 06
        </div>
      </div>

      <div className="opportunity-layout">
        <div className="opportunity-main">
          <div className="opportunity-kicker">
            <span className="opportunity-pulse" aria-hidden="true" />
            CURRENT OPPORTUNITY
          </div>
          <h2 id="opportunity-title">Cohort 06 is <em>open.</em></h2>
          <p>
            Start with the next honest conversation about what comes after SHS —
            then stay close as new fields, sessions and mentors open up.
          </p>
          <div className="opportunity-actions">
            <a className="btn btn-primary" href="#news">
              Get cohort updates <ArrowRight color="#fff" size={14} />
            </a>
            <a className="opportunity-link" href="#programs">
              See how it works <ArrowRight color="#fff" size={14} />
            </a>
          </div>
        </div>

        <div className="opportunity-signpost" aria-label="CA360 proof points">
          <span className="opportunity-signpost-label">THE SHORT VERSION</span>
          <div className="opportunity-signpost-number">06</div>
          <div className="opportunity-signpost-status">
            <span className="opportunity-status-dot" aria-hidden="true" />
            COHORT OPEN
          </div>
          <div className="opportunity-signpost-rule" />
          <div className="opportunity-signpost-meta">
            <span>2K+</span>
            <small>STUDENTS REACHED</small>
          </div>
          <div className="opportunity-signpost-meta">
            <span>9/10</span>
            <small>AVG SESSION RATING</small>
          </div>
        </div>
      </div>

      <div className="opportunity-paths" aria-label="Choose your path">
        {PATHS.map((path) => (
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
