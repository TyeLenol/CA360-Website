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
    ['Look around.', 'Explore mentors by the questions and career paths they know.'],
    ['Choose a starting point.', 'Open a profile, then request the person who feels closest to your question.'],
    ['We make the connection carefully.', 'CA360 confirms the next step and helps set the relationship up well.'],
  ];
  return (
    <section className="mt-how" aria-labelledby="mt-how-title">
              <div className="mt-how-head">
        <h2 id="mt-how-title">A person first.<br /><em>A process you can understand.</em></h2>
      </div>
      <div className="mt-how-grid">
        {steps.map(([title, copy]) => (
          <article className="mt-how-step" key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Spotlight({ mentor }) {
  return (
    <section className="mt-spotlight" aria-labelledby="mt-spotlight-title">
      <div className="mt-spotlight-media">
        <MentorPortrait mentor={mentor} />
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
          <h2 id="mt-directory-title">Choose the question<br /><em>before the title.</em></h2>
          <p>Start with the kind of help you need. Then meet the person whose path can make the next step less abstract.</p>
        </div>
        <div className="mt-directory-side">
          <div className="mt-directory-count"><strong>{mentors.length}</strong><span>people<br />in the index</span></div>
          <a className="btn btn-primary mt-directory-mentor-cta" href="/contact?type=mentor">Become a mentor <ArrowRight color="#0a1f29" size={14} /></a>
        </div>
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
          <a className="btn btn-secondary" href="/mentorship/find">Find a useful starting point <ArrowRight color="#0a1f29" size={14} /></a>
        </div>
      )}
    </section>
  );
}

export function MentorshipPage({ initialMentorSlug = '', initialMentors = MENTORS }) {
  const availableMentors = initialMentors?.length ? initialMentors : MENTORS;
  const [mentors] = useState(availableMentors);
  const [filter, setFilter] = useState('all');
  const [selectedSlug, setSelectedSlug] = useState(initialMentorSlug || availableMentors[0]?.slug || MENTORS[0].slug);
  const directoryRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMentor = params.get('mentor');
    const requestedTrack = params.get('track');
    if (requestedMentor && mentors.some((mentor) => mentor.slug === requestedMentor)) setSelectedSlug(requestedMentor);
    if (requestedTrack && (requestedTrack === 'all' || getTrack(requestedTrack))) setFilter(requestedTrack);
  }, [mentors]);

  const selected = mentors.find((mentor) => mentor.slug === selectedSlug) || mentors[0] || MENTORS[0];
  const filteredMentors = useMemo(() => filter === 'all' ? mentors : mentors.filter((mentor) => mentor.track === filter), [filter, mentors]);

  const selectMentor = (slug) => {
    setSelectedSlug(slug);
    const mentor = mentors.find((item) => item.slug === slug);
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
          <RouteMarker label="Mentorship" dark />
          <h1>Meet the people behind the next version of <em>you.</em></h1>
          <p className="mt-hero-dek">A curated starting point for students carrying a career question. Browse a real mentor, read the honest version of their path, and ask CA360 to help make the connection carefully.</p>
          <div className="mt-hero-actions">
            <a className="btn btn-primary" href="#mentor-directory">Explore the mentors <ArrowRight color="#0a1f29" size={14} /></a>
            <a className="mt-text-link mt-text-link-light" href="/mentorship/find">I&apos;m not sure who fits <ArrowRight color="currentColor" size={14} /></a>
          </div>
        </div>
      </section>

      <div ref={directoryRef}>
        <Spotlight mentor={selected} />
        <Directory filter={filter} setFilter={changeFilter} mentors={filteredMentors} selectedSlug={selectedSlug} onSelect={selectMentor} />
      </div>

      <HowItWorks />
    </main>
  );
}

export function MentorProfilePage({ mentorSlug, initialMentor, initialMentors = MENTORS }) {
  const mentor = initialMentor || initialMentors.find((item) => item.slug === mentorSlug) || getMentor(mentorSlug);
  if (!mentor) return null;
  const mentorList = initialMentors?.length ? initialMentors : MENTORS;
  const related = mentorList.filter((item) => item.slug !== mentor.slug && item.track === mentor.track).slice(0, 2);

  return (
    <main className="mentorship-page mt-profile-page">
      <section className="mt-profile-hero">
        <div className="mt-profile-topline">
          <a className="mt-back-link" href="/mentorship"><ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to the mentor index</a>
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
          <h2 id="mt-request-title">Ask CA360 to make the <em>introduction.</em></h2>
          <p>Requesting {mentor.name} tells CA360 where you would like to begin. The team will confirm fit, availability, and the safest next step before any introduction is made.</p>
        </div>
        <div className="mt-request-actions">
          <a className="btn btn-primary" href={`/contact?type=student&mentor=${mentor.slug}`}>Request {mentor.name} <ArrowRight color="#0a1f29" size={14} /></a>
          <a className="mt-text-link" href="/mentorship/find">Help me choose instead <ArrowRight color="currentColor" size={14} /></a>
        </div>
      </section>

      <section className="mt-profile-body">
        <div className="mt-profile-story">
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
        <div>
          <h2>Start with the question that has been sitting <em>there.</em></h2>
          <p>{mentor.firstConversation}</p>
        </div>
      </section>

      <section className="mt-profile-boundary">
        <p>{mentor.boundary}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-related" aria-labelledby="mt-related-title">
          <div><h2 id="mt-related-title">Another path<br /><em>might fit.</em></h2></div>
          <div className="mt-related-grid">{related.map((item) => <a href={`/mentorship/${item.slug}`} className="mt-related-card" key={item.slug}><MentorPortrait mentor={item} /><span><strong>{item.name}</strong><small>{item.specialty} · {item.field} · {item.role}</small></span><ArrowRight size={15} /></a>)}</div>
        </section>
      )}
    </main>
  );
}
