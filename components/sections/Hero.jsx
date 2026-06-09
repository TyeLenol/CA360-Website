"use client";

import { ArrowRight, Star } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          {Array.from({ length: 3 }).flatMap((_, i) => [
            <span key={i + '-a'}><Star size={10} color="#d68307" /> NOW ENROLLING · MEDICINE COHORT 06</span>,
            <span key={i + '-b'}><Star size={10} color="#d68307" /> 5 SESSIONS · 300+ STUDENTS REACHED</span>,
            <span key={i + '-c'}><Star size={10} color="#d68307" /> NEXT TRACKS · LAW · ENGINEERING · BUSINESS</span>,
          ])}
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-eyebrow" data-reveal>
          <Star size={10} color="#d68307" />
          A mentorship NGO for SHS graduates
        </div>

        <h1 className="hero-headline">
          <span data-reveal>From SHS</span>
          <span data-reveal data-reveal-delay="1">
            to <span className="hero-stamp">the career</span>
          </span>
          <span data-reveal data-reveal-delay="2">
            you were{' '}
            <em className="hero-italic">
              meant for
              <svg className="hero-scribble" viewBox="0 0 240 18" preserveAspectRatio="none">
                <path d="M2 12 C 30 4, 60 16, 90 8 S 160 16, 238 6" stroke="#d68307" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </em>
            .
          </span>
        </h1>

        <span className="hero-twinkle hero-twinkle-1" aria-hidden="true">✦</span>
        <span className="hero-twinkle hero-twinkle-2" aria-hidden="true">✦</span>
        <span className="hero-twinkle hero-twinkle-3" aria-hidden="true">✦</span>

        <div className="hero-foot" data-reveal data-reveal-delay="3">
          <div className="hero-foot-left">
            <p>
              Real guidance. Real mentors. Real clarity — for students stepping
              into medicine, law, engineering and business with nobody to ask.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary">
                Attend a session <ArrowRight color="#fff" size={14} />
              </a>
              <a className="btn btn-secondary">Become a mentor</a>
            </div>
          </div>
          <div className="hero-foot-right">
            <div className="hero-foot-num">
              5<span className="dot">·</span>300<span className="plus">+</span>
            </div>
            <div className="hero-foot-lab">SESSIONS · STUDENTS REACHED</div>
          </div>
        </div>

        <div className="hero-collage" aria-hidden="true">
          <div className="hero-tile hero-tile-1 has-tape">
            <PhotoPlaceholder tone="teal" label="SESSION 05" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="hero-tile hero-tile-2 has-tape">
            <PhotoPlaceholder tone="orange" label="MENTOR" style={{ width: '100%', height: '100%' }}>
              <Portrait seed={5} bg="transparent" tone="#d68307" accent="#fff" />
            </PhotoPlaceholder>
          </div>
          <div className="hero-tile hero-tile-3 has-tape">
            <div className="hero-tile-quote">
              &ldquo;Honestly life-changing. I finally understood what med school is actually like.&rdquo;
            </div>
            <div className="hero-tile-quote-src">— SHS-3 student, Cape Coast</div>
          </div>
        </div>

        <span className="hero-blob hero-blob-teal" aria-hidden="true" />
        <span className="hero-blob hero-blob-orange" aria-hidden="true" />
      </div>
    </section>
  );
}
