'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { RouteMarker } from '../shared/RouteMarker';
import { getMentor, getTrack, MENTORS, MENTOR_TRACKS } from '../../data/mentors';

function MentorPortrait({ mentor, className = '' }) {
  return (
    <PhotoPlaceholder
      tone={mentor.tone}
      label={`MENTOR · ${mentor.field.toUpperCase()}`}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <Portrait seed={mentor.seed} bg="transparent" tone="#d68307" />
    </PhotoPlaceholder>
  );
}

function MentorStatus({ mentor }) {
  return <span className={`mt-status mt-status-${mentor.status}`}>{mentor.statusLabel}</span>;
}

function TrackPill({ trackId }) {
  const track = getTrack(trackId);
  if (!track) return null;
  return <span className={`mt-track-pill mt-track-${track.state}`}>{track.label} · {track.stateLabel}</span>;
}

function MentorCard({ mentor, selected, onSelect }) {
  return (
    <article className={`mt-card${selected ? ' is-selected' : ''}`}>
      <button
        type="button"
        className="mt-card-select"
        aria-pressed={selected}
        onClick={() => onSelect(mentor.slug)}
      >
        <span className="mt-card-photo">
          <MentorPortrait mentor={mentor} />
          <span className="mt-card-index">{selected ? 'SELECTED' : `0${MENTORS.indexOf(mentor) + 1}`}</span>
        </span>
        <span className="mt-card-copy">
          <span className="mt-card-topline"><MentorStatus mentor={mentor} /><span>{mentor.specialty}</span></span>
          <strong>{mentor.name}</strong>
          <span className="mt-card-role">{mentor.role}</span>
          <span className="mt-card-positioning">{mentor.positioning}</span>
          <span className="mt-card-action">{selected ? 'Selected for the spotlight' : 'Bring into the spotlight'} <ArrowRight size={14} /></span>
        </span>
      </button>
      <a className="mt-card-profile" href={`/mentorship/${mentor.slug}`}>
        View {mentor.name}&apos;s profile <ArrowRight size={13} />
      </a>
    </article>
  );
}

function HowItWorks() {
  const steps = [
    ['01', 'Look around.', 'Explore mentors by the questions and career paths they know.'],
    ['02', 'Choose a starting point.', 'Open a profile, then request the person who feels closest to your question.'],
    ['03', 'We make the connection carefully.', 'CA360 confirms the next step and helps set the relationship up well.'],
  ];
  return (
    <section className="mt-how" aria-labelledby="mt-how-title">
      <div className="mt-how-head">
        <span className="sec-eyebrow">HOW THE INTRODUCTION WORKS</span>
        <h2 id="mt-how-title">A person first.<br /><em>A process you can understand.</em></h2>
      </div>
      <div className="mt-how-grid">
        {steps.map(([number, title, copy]) => (
          <article className="mt-how-step" key={number}>
            <span className="mt-how-number">{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrackStates() {
  return (
    <div className="mt-track-states" aria-label="CA360 career track status">
      {MENTOR_TRACKS.map((track) => (
        <div className={`mt-track-state mt-track-state-${track.state}`} key={track.id}>
          <span className="mt-track-state-label">{track.stateLabel}</span>
          <strong>{track.label}</strong>
          <p>{track.description}</p>
          {track.state === 'future' && <a href="/contact?type=student">Tell CA360 what you need <ArrowRight size={13} /></a>}
        </div>
      ))}
    </div>
  );
}

function Spotlight({ mentor }) {
  return (
    <section className="mt-spotlight" aria-labelledby="mt-spotlight-title">
      <div className="mt-spotlight-media">
        <MentorPortrait mentor={mentor} />
        <div className="mt-spotlight-mark">PATH / {String(MENTORS.indexOf(mentor) + 1).padStart(2, '0')} — {mentor.field.toUpperCase()}</div>
        <div className="mt-spotlight-stamp">A REAL<br />STARTING<br /><em>POINT.</em></div>
      </div>
      <div className="mt-spotlight-copy">
        <div className="mt-spotlight-kicker"><MentorStatus mentor={mentor} /> <TrackPill trackId={mentor.track} /></div>
        <p className="mt-spotlight-question">{mentor.positioning}</p>
        <h2 id="mt-spotlight-title">{mentor.name}</h2>
        <p className="mt-spotlight-role">{mentor.specialty} · {mentor.role}</p>
        <p className="mt-spotlight-path">{mentor.path}</p>
        <blockquote>&ldquo;{mentor.quote}&rdquo;</blockquote>
        <div className="mt-spotlight-actions">
          <a className="btn btn-primary" href={`/mentorship/${mentor.slug}`}>Read the full profile <ArrowRight color="#0a1f29" size={14} /></a>
          <a className="mt-text-link" href={`/contact?type=student&mentor=${mentor.slug}`}>Request this mentor <ArrowRight color="currentColor" size={14} /></a>
        </div>
      </div>
    </section>
  );
}

function Directory({ filter, setFilter, mentors, selectedSlug, onSelect }) {
  return (
    <section className="mt-directory" id="mentor-directory" aria-labelledby="mt-directory-title">
      <div className="mt-directory-head">
        <div>
          <span className="sec-eyebrow">THE MENTOR INDEX</span>
          <h2 id="mt-directory-title">Choose the question<br /><em>before the title.</em></h2>
          <p>Start with the kind of help you need. Then meet the person whose path can make the next step less abstract.</p>
        </div>
        <div className="mt-directory-count"><strong>{mentors.length}</strong><span>people<br />in the index</span></div>
      </div>

      <div className="mt-filter-bar" role="group" aria-label="Filter mentors by career track">
        <button type="button" className={filter === 'all' ? 'is-active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All paths</button>
        {MENTOR_TRACKS.map((track) => (
          <button type="button" className={filter === track.id ? 'is-active' : ''} aria-pressed={filter === track.id} onClick={() => setFilter(track.id)} key={track.id}>
            {track.label}<span>{track.state === 'future' ? 'soon' : track.state}</span>
          </button>
        ))}
      </div>

      {mentors.length > 0 ? (
        <div className="mt-roster" role="list">
          {mentors.map((mentor) => (
            <div role="listitem" key={mentor.slug}>
              <MentorCard mentor={mentor} selected={mentor.slug === selectedSlug} onSelect={onSelect} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-empty">
          <span className="mt-empty-index">NO OPEN MENTORS IN THIS PATH — YET.</span>
          <h3>This door is still being built carefully.</h3>
          <p>Tell CA360 what you hoped to find and the team can point you toward the nearest useful conversation.</p>
          <a className="btn btn-secondary" href="/contact?type=student">Ask CA360 for a starting point <ArrowRight color="#0a1f29" size={14} /></a>
        </div>
      )}
    </section>
  );
}

function TrustNote() {
  return (
    <section className="mt-trust" aria-labelledby="mt-trust-title">
      <div className="mt-trust-index">BEFORE YOU ASK</div>
      <div className="mt-trust-copy">
        <span className="sec-eyebrow">A CLEAR NEXT STEP</span>
        <h2 id="mt-trust-title">Choosing a mentor starts a <em>conversation</em>, not an instant match.</h2>
        <p>When you request someone, CA360 receives your preference and helps confirm the right next step, availability, programme fit, and the safest way to begin. This page is a starting point for a human introduction — not an unmoderated private connection.</p>
        <div className="mt-trust-links">
          <a href="/contact?type=student">I need help choosing <ArrowRight color="currentColor" size={14} /></a>
          <a href="/contact?type=mentor">I want to become a mentor <ArrowRight color="currentColor" size={14} /></a>
        </div>
      </div>
    </section>
  );
}

export function MentorshipPage({ initialMentorSlug = '' }) {
  const [filter, setFilter] = useState('all');
  const [selectedSlug, setSelectedSlug] = useState(initialMentorSlug || MENTORS[0].slug);
  const directoryRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMentor = params.get('mentor');
    const requestedTrack = params.get('track');
    if (requestedMentor && getMentor(requestedMentor)) setSelectedSlug(requestedMentor);
    if (requestedTrack && (requestedTrack === 'all' || getTrack(requestedTrack))) setFilter(requestedTrack);
  }, []);

  const selected = getMentor(selectedSlug) || MENTORS[0];
  const filteredMentors = useMemo(() => filter === 'all' ? MENTORS : MENTORS.filter((mentor) => mentor.track === filter), [filter]);

  const selectMentor = (slug) => {
    setSelectedSlug(slug);
    const mentor = getMentor(slug);
    if (mentor && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mentor', mentor.slug);
      window.history.replaceState({}, '', url);
    }
    window.requestAnimationFrame(() => directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const changeFilter = (nextFilter) => {
    setFilter(nextFilter);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextFilter === 'all') url.searchParams.delete('track');
      else url.searchParams.set('track', nextFilter);
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <main className="mentorship-page">
      <section className="mt-hero" id="mentorship-top">
        <div className="mt-hero-main" data-reveal>
          <RouteMarker index="05" label="Mentorship" context="Choose carefully" />
          <p className="mt-kicker">REAL PATHS · HONEST ANSWERS · A HUMAN INTRODUCTION</p>
          <h1>Meet the people behind the next version of <em>you.</em></h1>
          <p className="mt-hero-dek">A curated starting point for students carrying a career question. Browse a real mentor, read the honest version of their path, and ask CA360 to help make the connection carefully.</p>
          <div className="mt-hero-actions">
            <a className="btn btn-primary" href="#mentor-directory">Explore the mentors <ArrowRight color="#0a1f29" size={14} /></a>
            <a className="mt-text-link mt-text-link-light" href="/contact?type=student">I&apos;m not sure who fits <ArrowRight color="currentColor" size={14} /></a>
          </div>
        </div>
        <div className="mt-hero-side" data-reveal data-reveal-delay="1">
          <div className="mt-hero-side-label">THE INDEX / 2026</div>
          <div className="mt-hero-side-line" aria-hidden="true" />
          <p>Five people.<br /><em>Many ways in.</em></p>
          <span>Scroll to browse · tap to choose</span>
        </div>
      </section>

      <section className="mt-intro-strip" aria-label="Mentorship promise">
        <span>THE CA360 MENTOR INDEX</span>
        <p>Not a leaderboard. Not a perfect-match machine. A thoughtful first door.</p>
        <span>GHANA · PATHS · QUESTIONS</span>
      </section>

      <HowItWorks />

      <div ref={directoryRef}>
        <Spotlight mentor={selected} />
        <Directory filter={filter} setFilter={changeFilter} mentors={filteredMentors} selectedSlug={selectedSlug} onSelect={selectMentor} />
      </div>

      <TrackStates />
      <TrustNote />
    </main>
  );
}

export function MentorProfilePage({ mentorSlug }) {
  const mentor = getMentor(mentorSlug);
  if (!mentor) return null;
  const related = MENTORS.filter((item) => item.slug !== mentor.slug && item.track === mentor.track).slice(0, 2);

  return (
    <main className="mentorship-page mt-profile-page">
      <section className="mt-profile-hero">
        <div className="mt-profile-topline">
          <a className="mt-back-link" href="/mentorship"><ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to the mentor index</a>
          <span>PROFILE / {String(MENTORS.indexOf(mentor) + 1).padStart(2, '0')}</span>
        </div>
        <div className="mt-profile-grid">
          <div className="mt-profile-photo"><MentorPortrait mentor={mentor} /></div>
          <div className="mt-profile-heading">
            <MentorStatus mentor={mentor} />
            <TrackPill trackId={mentor.track} />
            <h1>{mentor.name}</h1>
            <p className="mt-profile-role">{mentor.specialty} · {mentor.role}</p>
            <strong>{mentor.positioning}</strong>
          </div>
        </div>
      </section>

      <section className="mt-request-panel mt-request-panel-priority" aria-labelledby="mt-request-title">
        <div>
          <span className="sec-eyebrow">YOUR NEXT STEP</span>
          <h2 id="mt-request-title">Ask CA360 to make the <em>introduction.</em></h2>
          <p>Requesting {mentor.name} tells CA360 where you would like to begin. The team will confirm fit, availability, and the safest next step before any introduction is made.</p>
        </div>
        <div className="mt-request-actions">
          <a className="btn btn-primary" href={`/contact?type=student&mentor=${mentor.slug}`}>Request {mentor.name} <ArrowRight color="#0a1f29" size={14} /></a>
          <a className="mt-text-link" href="/contact?type=student">Help me choose instead <ArrowRight color="currentColor" size={14} /></a>
        </div>
      </section>

      <section className="mt-profile-body">
        <div className="mt-profile-story">
          <span className="sec-eyebrow">THE PATH</span>
          <h2>There is more than one way to get <em>here.</em></h2>
          <p>{mentor.path}</p>
          <blockquote>&ldquo;{mentor.quote}&rdquo;</blockquote>
          <div className="mt-profile-question"><span>A QUESTION I LOVE</span><strong>{mentor.firstQuestion}</strong></div>
        </div>
        <aside className="mt-profile-fit">
          <span className="mt-profile-fit-label">SPECIALTY</span>
          <strong className="mt-profile-specialty">{mentor.specialty}</strong>
          <span className="mt-profile-fit-label">I CAN HELP WITH</span>
          <ul>{mentor.helpWith.map((item) => <li key={item}>{item}</li>)}</ul>
          <span className="mt-profile-fit-label">GOOD FOR</span>
          <div className="mt-chip-list">{mentor.stages.map((item) => <span key={item}>{item}</span>)}</div>
          <span className="mt-profile-fit-label">CONVERSATION</span>
          <div className="mt-chip-list">{mentor.formats.map((item) => <span key={item}>{item}</span>)}</div>
        </aside>
      </section>

      <section className="mt-profile-conversation">
        <div className="mt-profile-conversation-label">WHAT A FIRST CONVERSATION CAN COVER</div>
        <div>
          <h2>Start with the question that has been sitting <em>there.</em></h2>
          <p>{mentor.firstConversation}</p>
        </div>
      </section>

      <section className="mt-profile-boundary">
        <div className="mt-profile-boundary-mark">A USEFUL<br />BOUNDARY</div>
        <p>{mentor.boundary}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-related" aria-labelledby="mt-related-title">
          <div><span className="sec-eyebrow">KEEP EXPLORING</span><h2 id="mt-related-title">Another path<br /><em>might fit.</em></h2></div>
          <div className="mt-related-grid">{related.map((item) => <a href={`/mentorship/${item.slug}`} className="mt-related-card" key={item.slug}><MentorPortrait mentor={item} /><span><strong>{item.name}</strong><small>{item.specialty} · {item.field} · {item.role}</small></span><ArrowRight size={15} /></a>)}</div>
        </section>
      )}
    </main>
  );
}
