"use client";

import { useRef } from 'react';
import { ArrowRight } from '../shared/Icons';
import { useScrollProgress } from '../../hooks/ui-hooks';

const cards = [
  { num: '01',
    title: 'Academic guidance.',
    desc: 'Course-by-course advice from people who passed the same papers, two or three years before you. No theory — only what worked.',
    tape: 'rgba(54, 114, 143, 0.55)',
    x:  -120, rot: -3.5, startP: 0.08, endP: 0.34 },
  { num: '02',
    title: 'Career clarity.',
    desc: 'A clear picture of what each profession actually looks like on a Tuesday morning — not just at graduation. The good and the boring.',
    tape: 'rgba(214, 131, 7, 0.55)',
    x:    0, rot:  2.5, startP: 0.34, endP: 0.62 },
  { num: '03',
    title: 'Personal growth.',
    desc: "Leadership, stress management, work-life balance — and the permission to build an identity that isn't only your job title.",
    tape: 'rgba(54, 114, 143, 0.55)',
    x:  120, rot: -1.5, startP: 0.60, endP: 0.88 },
];

export function Gain() {
  const wrapRef = useRef(null);
  const progress = useScrollProgress(wrapRef);

  const fallState = (startP, endP) => {
    const raw = Math.max(0, Math.min(1, (progress - startP) / (endP - startP)));
    const eased = 1 - Math.pow(1 - raw, 3);
    const wobble = raw > 0.85 ? Math.sin((raw - 0.85) * Math.PI * 6.6) * (1 - raw) * 8 : 0;
    return { raw, eased, wobble };
  };

  return (
    <section id="gain" className="gain-sec" ref={wrapRef}>
      <div className="gain-pin">
        <div className="gain-head">
          <div className="sec-eyebrow" data-reveal>05 — What you gain</div>
          <h2 className="gain-title" data-reveal data-reveal-delay="1">
            Three things you walk away with — <em>every time</em>.
          </h2>
          <p className="gain-sub" data-reveal data-reveal-delay="2">
            Whether you came for clarity, or you came for the community, these
            are the things you take home.
          </p>
        </div>

        <div className="gain-stack">
          {cards.map((c, i) => {
            const { raw, eased, wobble } = fallState(c.startP, c.endP);
            const fromY = -640;
            const toY = i * 14;
            const y = fromY + eased * (toY - fromY);
            const r = eased * c.rot + wobble;
            const op = raw > 0.02 ? 1 : 0;

            return (
              <article
                key={c.num}
                className={'gain-card gain-card-' + (i + 1)}
                style={{
                  '--tape': c.tape,
                  transform: `translateX(${c.x}px) translateY(${y}px) rotate(${r}deg)`,
                  opacity: op,
                  zIndex: 10 + i,
                }}
              >
                <span className="gain-tape" />
                <div className="gain-num">{c.num}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <a className="gain-link">Read more <ArrowRight size={14} color="#d68307" /></a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
