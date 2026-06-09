"use client";

import { useState } from 'react';
import { ArrowRight } from '../shared/Icons';

const FAQS = [
  { id: 'who',  q: 'Who can attend a session?',
    a: 'Any SHS student, recent graduate, or first-year undergrad. The Medicine track is open to SHS-3 science students and first-/second-year medical students. We have never turned anyone away for being "not quite the right stage" — if the topic interests you, you belong in the room.',
    cat: 'STUDENTS' },
  { id: 'free', q: "Is it really free? What's the catch?",
    a: 'Yes — free, always. There is no catch. Sessions are funded by partner schools, individual donors, and the mentors\' time. Our only ask is that you show up prepared, and that you pass what you learn on to one person behind you.',
    cat: 'COSTS' },
  { id: 'post', q: "I'm past SHS already. Still useful?",
    a: "Absolutely. Roughly 40% of our community is in their first or second year of university, often re-evaluating their choice or planning for residency, internships, or grad school. The earlier the better — but it's never too late.",
    cat: 'STUDENTS' },
  { id: 'mentor', q: 'How do I become a mentor?',
    a: 'Fill in the mentor application (linked in the nav). We ask for a short bio, the track you\'d mentor in (Medicine for now), and your availability. We aim to respond within 14 days and pair you with a student within 30.',
    cat: 'MENTORS' },
  { id: 'school', q: 'Do you visit schools? Can mine host you?',
    a: 'Yes. We run in-person school visits termly, by invitation. A teacher, headteacher, or student rep can reach out via the Partner form. We bring 2-3 mentors, run a 90-120 minute session, and stay for an hour of open Q&A. Free for partner schools.',
    cat: 'SCHOOLS' },
  { id: 'tracks', q: 'When do Law, Engineering, Business open?',
    a: "Law in Q2 2026, Engineering in Q4 2026, Business in 2027. Each opens only when we have at least 5 mentors who've actually walked the path — we never run a track on theory alone. You can sign up for the waiting list any time.",
    cat: 'FIELDS' },
  { id: 'lang', q: 'Are sessions in English?',
    a: 'Yes — sessions run in English, though mentors regularly switch to Twi, Ga, Ewe, or Hausa during open Q&A when it helps a student think more clearly. Recordings are in English with captions.',
    cat: 'GENERAL' },
];

export function FAQ() {
  const [active, setActive] = useState(0);
  const m = FAQS[active];

  return (
    <section id="faq" className="faq-sec">
      <div className="faq-head">
        <div className="sec-eyebrow" data-reveal>11 — Common questions</div>
        <h2 className="faq-title" data-reveal data-reveal-delay="1">
          Anything you wanted to <em>ask</em>.
        </h2>
        <p className="faq-sub" data-reveal data-reveal-delay="2">
          The questions students and mentors actually send us. Pick one on the
          left — the answer slides in on the right.
        </p>
      </div>

      <div className="faq-stage" data-reveal>
        <ol className="faq-list" role="tablist">
          {FAQS.map((f, i) => (
            <li
              key={f.id}
              className={'faq-item' + (i === active ? ' is-active' : '')}
              role="tab"
            >
              <button onClick={() => setActive(i)}>
                <span className="faq-item-n">0{i + 1}</span>
                <span className="faq-item-q">
                  {f.q}
                  <span className="faq-item-cat">{f.cat}</span>
                </span>
                <span className="faq-item-chev" aria-hidden="true">
                  <ArrowRight size={16} color="currentColor" />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="faq-answer">
          <div className="faq-answer-meta">
            <span className="faq-answer-n">0{active + 1} / 0{FAQS.length}</span>
            <span className="faq-answer-cat">{m.cat}</span>
          </div>
          <h3 className="faq-answer-q" key={'q-' + m.id}>{m.q}</h3>
          <p className="faq-answer-a" key={'a-' + m.id}>{m.a}</p>

          <div className="faq-answer-foot">
            <a className="faq-answer-link">
              Ask a follow-up question <ArrowRight size={14} color="#d68307" />
            </a>
            <span className="faq-answer-hint">
              Still stuck? <strong>hello@careerarcadia360.org</strong>
            </span>
          </div>

          <span className="faq-answer-deco" aria-hidden="true">
            {('0' + (active + 1)).slice(-2)}
          </span>
        </div>
      </div>
    </section>
  );
}
