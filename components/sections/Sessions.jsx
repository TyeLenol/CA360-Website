'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, PinIcon } from '../shared/Icons';
import { PhotoPlaceholder } from '../shared/Placeholders';
import { useInView } from '../../hooks/ui-hooks';

const SESSIONS = [
  { id: 's5', num: '05', date: 'FEB 2026', cat: 'CAREER TALK', tone: 'teal', title: 'What your career actually looks like — from people living it.', body: 'Professionals across three fields broke down what their first year post-university really looked like — the unexpected parts, the things nobody tells you.', venue: 'University of Ghana · Legon', duration: '90 min · live', attendees: 78 },
  { id: 's4', num: '04', date: 'DEC 2025', cat: 'SCHOOLS OUTREACH', tone: 'orange', title: 'Career conversations for SHS-3 students — before the pressure decides for you.', body: 'An in-person career talk for final-year students navigating choices before WASSCE results. Real voices, no scripts.', venue: "Wesley Girls' SHS · Cape Coast", duration: '120 min · in person', attendees: 62 },
  { id: 's3', num: '03', date: 'OCT 2025', cat: 'CAREER PATHS', tone: 'deep', title: 'There is no one path — navigating multiple directions at once.', body: 'Professionals who pivoted, combined fields, or carved their own routes — on building a career that fits you, not just a CV.', venue: 'KNUST · Kumasi', duration: '90 min · live', attendees: 54 },
  { id: 's2', num: '02', date: 'JUL 2025', cat: 'ADMISSIONS', tone: 'warm', title: 'Getting in — navigating tertiary applications across Ghana.', body: 'KNUST, UG, UCC and beyond: deadlines, requirements, interviews and the decisions that quietly determine where you end up.', venue: 'Online · open cohort', duration: '60 min · live', attendees: 64 },
  { id: 's1', num: '01', date: 'APR 2025', cat: 'KICKOFF', tone: 'soft', title: 'Why we built this — the first CA360 session, ever.', body: "A founders-only conversation: what we wished someone had told us at 17, and what we promised this org would never become.", venue: 'Online · friends and family', duration: '60 min · live', attendees: 42 },
];

export function Sessions({ initialSessions = null }) {
  const sessions = initialSessions?.length ? initialSessions : SESSIONS;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.2, once: false });

  useEffect(() => {
    if (paused || !inView || sessions.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % sessions.length), 6000);
    return () => clearInterval(t);
  }, [paused, inView, sessions.length]);

  useEffect(() => {
    if (active >= sessions.length) setActive(0);
  }, [active, sessions.length]);

  const prev = () => setActive((i) => (i - 1 + sessions.length) % sessions.length);
  const next = () => setActive((i) => (i + 1) % sessions.length);
  const activeSession = sessions[active] || sessions[0];

  return (
    <section id="sessions" className="sessions-sec" ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="sessions-head">
        <h2 className="sessions-title" data-reveal data-reveal-delay="1">Recent <em>sessions</em>,<br />from the journal.</h2>
        <a className="sessions-all" href="/journal" data-reveal data-reveal-delay="2">The full journal <ArrowRight size={14} /></a>
      </div>

      <div className="sessions-carousel" data-reveal>
        {sessions.map((session, i) => {
          let offset = i - active;
          if (offset > sessions.length / 2) offset -= sessions.length;
          if (offset < -sessions.length / 2) offset += sessions.length;
          const absOff = Math.abs(offset);
          const visible = absOff <= 2;
          const tx = offset * 360;
          const scale = absOff === 0 ? 1 : (absOff === 1 ? 0.78 : 0.58);
          const opacity = visible ? (absOff === 0 ? 1 : (absOff === 1 ? 0.55 : 0.18)) : 0;
          const z = 10 - absOff;
          const rot = offset * -2;

          return (
            <div key={session.id} id={`session-${session.id}`} className={'sessions-card' + (absOff === 0 ? ' is-center' : '')} role="tabpanel" aria-labelledby={`session-tab-${session.id}`} style={{ transform: `translate(-50%, 0) translateX(${tx}px) scale(${scale}) rotate(${rot}deg)`, opacity, zIndex: z, pointerEvents: absOff === 0 ? 'auto' : 'none' }} aria-hidden={absOff !== 0} inert={absOff !== 0}>
              <div className="sessions-card-img"><PhotoPlaceholder tone={session.tone} label={'SESSION ' + session.num} style={{ width: '100%', height: '100%' }} /><span className="sessions-card-num">№ {session.num}</span><span className="sessions-card-date">{session.date}</span></div>
              <div className="sessions-card-body"><div className="sessions-card-meta"><span>{session.cat}</span><span className="dot" /><span>{session.duration}</span><span className="dot" /><span>{session.attendees} attendees</span></div><h3>{session.title}</h3><p>{session.body}</p><div className="sessions-card-venue"><PinIcon size={14} color="#d68307" /> Hosted at <span>{session.venue}</span></div><div className="sessions-card-cta"><a className="sessions-read" href="/journal#journal-grid">Explore the journal <ArrowRight size={14} /></a></div></div>
            </div>
          );
        })}
      </div>

      <div className="sessions-controls">
        <button type="button" className="sessions-arrow" onClick={prev} aria-label="Previous session"><ArrowLeft size={18} /></button>
        <div className="sessions-dots" role="tablist" aria-label="Choose a session">{sessions.map((session, i) => <button type="button" key={session.id} id={`session-tab-${session.id}`} className={'sessions-dot' + (i === active ? ' is-active' : '')} onClick={() => setActive(i)} role="tab" aria-selected={i === active} aria-controls={`session-${session.id}`} tabIndex={i === active ? 0 : -1} aria-label={'Go to session ' + session.num} />)}</div>
        <button type="button" className="sessions-arrow" onClick={next} aria-label="Next session"><ArrowRight size={18} /></button>
      </div>
    </section>
  );
}
