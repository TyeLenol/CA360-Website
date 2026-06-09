"use client";

import { useRef } from 'react';
import { useScrollProgress, useInView, useCountUp } from '../../hooks/ui-hooks';

const STATS = [
  { v: '5',  p: '',  l: 'Career sessions hosted',
    p2: 'Each one a 90-minute live session with professionals sharing what their careers actually look like.',
    startP: 0.55, endP: 0.70 },
  { v: '9',  p: '/10', l: 'Average session rating',
    p2: 'From post-session surveys across all cohorts — rated by students on clarity and usefulness.',
    startP: 0.65, endP: 0.80 },
  { v: '300', p: '+', l: 'Community members',
    p2: 'Students, mentors and alumni who keep showing up — and keep sending others our way.',
    startP: 0.75, endP: 0.90 },
];

export function Impact() {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const progress = useScrollProgress(wrapRef);
  const inView = useInView(wrapRef, { threshold: 0.05, once: true });
  const count = useCountUp(2000, inView, { duration: 1800 });

  const numScale = 0.7 + Math.min(0.4, progress * 1) * 0.75;
  const numOpacity = Math.min(1, progress * 4);
  const quoteOpacity = Math.max(0, Math.min(1, (progress - 0.35) * 4));
  const quoteY = (1 - Math.max(0, Math.min(1, (progress - 0.35) * 4))) * 24;

  const statState = (s) => {
    const raw = Math.max(0, Math.min(1, (progress - s.startP) / (s.endP - s.startP)));
    const eased = 1 - Math.pow(1 - raw, 3);
    return { opacity: eased, y: (1 - eased) * 64 };
  };

  return (
    <section id="impact" className="impact-sec" ref={wrapRef}>
      <div className="impact-pin">
        <div className="impact-inner" ref={innerRef}>
          <div className="impact-tag">
            <span className="impact-tag-pulse" />
            PROOF / 24 MONTHS OF WORK
          </div>

          <div
            className="impact-num"
            style={{
              transform: `scale(${numScale})`,
              opacity: numOpacity,
              transformOrigin: 'left bottom',
            }}
          >
            {count}<span className="impact-num-plus">+</span>
          </div>

          <p
            className="impact-sub"
            style={{ opacity: quoteOpacity, transform: `translateY(${quoteY}px)` }}
          >
            students walked into a room they weren&apos;t supposed to feel
            ready for — and walked out with the language to describe what
            comes next.
          </p>

          <div
            className="impact-quote"
            style={{ opacity: quoteOpacity, transform: `translateY(${quoteY}px) rotate(2deg)` }}
          >
            <span className="impact-quote-mark">&ldquo;</span>
            Inspiring. Life-changing. I finally knew what direction to go — and
            what kind of professional I wanted to become.
            <small>— PARTICIPANT · SESSION 04 · WESLEY GIRLS&apos;</small>
          </div>

          <div className="impact-stats">
            {STATS.map((s) => {
              const { opacity, y } = statState(s);
              return (
                <div
                  className="impact-stat"
                  key={s.l}
                  style={{ opacity, transform: `translateY(${y}px)` }}
                >
                  <div className="impact-stat-v">
                    {s.v}{s.p && <em>{s.p}</em>}
                  </div>
                  <div className="impact-stat-l">{s.l}</div>
                  <p>{s.p2}</p>
                </div>
              );
            })}
          </div>

          <div className="impact-scroll-cue" aria-hidden="true">
            <span className="impact-cue-line" />
            <span className="impact-cue-track" style={{ '--p': progress }}>
              <span className="impact-cue-dot" />
            </span>
            <span className="impact-cue-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
