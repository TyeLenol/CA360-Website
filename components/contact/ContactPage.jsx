'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geography, Geographies, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import ghanaRegions from '../../data/ghana-regions.topo.json';
import { ArrowRight } from '../shared/Icons';
import { RouteMarker } from '../shared/RouteMarker';
import { usePrefersReducedMotion } from '../../hooks/ui-hooks';
import { getMentor } from '../../data/mentors';

const PRESENCE = [
  {
    id: 'korle-bu',
    name: 'Korle Bu',
    city: 'Accra',
    region: 'Greater Accra',
    kind: 'Medicine conversations',
    detail: 'The starting point for CA360’s first career conversations and mentor-led sessions.',
    coordinates: [-0.225, 5.65],
  },
  {
    id: 'knust',
    name: 'KNUST · Kumasi',
    city: 'Kumasi',
    region: 'Ashanti',
    kind: 'Campus community',
    detail: 'One of the communities in the conversation as the network grows beyond Accra.',
    coordinates: [-1.6244, 6.6885],
  },
  {
    id: 'ucc',
    name: 'UCC · Cape Coast',
    city: 'Cape Coast',
    region: 'Central',
    kind: 'Student access',
    detail: 'A marker for the students and mentors making the path clearer on the coast.',
    coordinates: [-1.2554, 5.1053],
  },
];

const PATHS = [
  {
    id: 'student',
    number: '01',
    eyebrow: 'FOR STUDENTS',
    title: 'I have a career question.',
    description: 'Sessions, fields, access, or the next move that feels hardest to see.',
    reply: 'Then you are in the right room. Tell us what you are trying to figure out.',
    subject: 'Student enquiry',
    messageLabel: 'What would you like help figuring out?',
    messageHint: 'A course, a career, a session, or the question you have not known who to ask.',
  },
  {
    id: 'mentor',
    number: '02',
    eyebrow: 'FOR PROFESSIONALS',
    title: 'I want to mentor.',
    description: 'Share the lived version of a career with someone a step behind you.',
    reply: 'Good. The best guidance starts with someone willing to tell the honest version.',
    subject: 'Mentor interest',
    messageLabel: 'What would you like us to know about your interest?',
    messageHint: 'Tell us your field, where you are based, or what kind of student you hope to support.',
  },
  {
    id: 'partner',
    number: '03',
    eyebrow: 'FOR SCHOOLS & PARTNERS',
    title: 'I want to partner.',
    description: 'Host a session, open a career track, or support a cohort that needs a door opened.',
    reply: 'Let us make the opportunity practical. Tell us what you want to build together.',
    subject: 'Partnership enquiry',
    messageLabel: 'What would you like to build with CA360?',
    messageHint: 'A school session, an institutional partnership, a sponsored cohort, or something new.',
  },
  {
    id: 'general',
    number: '04',
    eyebrow: 'EVERYTHING ELSE',
    title: 'I have another question.',
    description: 'Media, support, the organisation itself, or anything that does not fit a box.',
    reply: 'No wrong door. Send the question and we will point it in the right direction.',
    subject: 'General enquiry',
    messageLabel: 'What is on your mind?',
    messageHint: 'A little context helps us send a useful reply.',
  },
];

function GhanaPresence() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PRESENCE[activeIndex];

  const choosePlace = (index) => setActiveIndex(index);
  const movePlace = (event, index) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = (index + delta + PRESENCE.length) % PRESENCE.length;
    choosePlace(next);
    document.getElementById(`ct-place-tab-${next}`)?.focus();
  };

  return (
    <section className="ct-presence" data-reveal aria-labelledby="ct-presence-title">
      <div className="ct-presence-head">
        <div>
          <span className="ct-presence-kicker">WHERE THE CONVERSATION TRAVELS</span>
          <h2 id="ct-presence-title">A growing conversation across <em>Ghana</em>.</h2>
        </div>
        <span className="ct-presence-count">03 PLACES · 16 REGIONS</span>
      </div>
      <div className="ct-presence-layout">
        <div className="ct-map-shell">
          <span className="ct-map-coordinate ct-map-coordinate-top">11°N</span>
          <span className="ct-map-coordinate ct-map-coordinate-bottom">5°N</span>
          <span className="ct-map-coordinate ct-map-coordinate-east">1°W</span>
          <span className="ct-map-coordinate ct-map-coordinate-west">3°W</span>
          <ComposableMap
            className="ct-map-svg"
            projection="geoMercator"
            projectionConfig={{ scale: 3300, center: [-1.15, 7.7] }}
            viewBox="0 0 800 620"
            role="img"
            aria-label="Map of Ghana showing CA360 presence markers in Accra, Kumasi, and Cape Coast"
          >
            <title>CA360 presence across Ghana</title>
            <Geographies geography={ghanaRegions}>
              {({ geographies }) => (
                <Fragment>
                  {geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={geo.properties?.region === active.region ? '#36728f' : 'rgba(254, 249, 238, 0.09)'}
                      stroke="rgba(254, 249, 238, 0.42)"
                      strokeWidth={0.75}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                    />
                  ))}
                  {PRESENCE.map((place, index) => (
                    <Marker key={place.id} coordinates={place.coordinates}>
                      <g
                        className={'ct-map-marker' + (index === activeIndex ? ' is-active' : '')}
                        role="button"
                        tabIndex={index === activeIndex ? 0 : -1}
                        aria-label={`Show ${place.name} details`}
                        onClick={() => choosePlace(index)}
                        onKeyDown={(event) => movePlace(event, index)}
                      >
                        <circle className="ct-map-marker-halo" r={index === activeIndex ? 19 : 13} />
                        <circle className="ct-map-marker-dot" r={index === activeIndex ? 7 : 5} />
                        <text className="ct-map-marker-label" x="12" y="4">{place.city}</text>
                      </g>
                    </Marker>
                  ))}
                </Fragment>
              )}
            </Geographies>
          </ComposableMap>
          <span className="ct-map-note">CA360 · GHANA</span>
        </div>
        <div className="ct-presence-info">
          <div className="ct-presence-tabs" role="tablist" aria-label="CA360 locations">
            {PRESENCE.map((place, index) => (
              <button
                type="button"
                role="tab"
                id={`ct-place-tab-${index}`}
                key={place.id}
                className={'ct-presence-tab' + (index === activeIndex ? ' is-active' : '')}
                aria-selected={index === activeIndex}
                aria-controls="ct-presence-panel"
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => choosePlace(index)}
                onKeyDown={(event) => movePlace(event, index)}
              >
                <span>{`0${index + 1}`}</span>
                <strong>{place.name}</strong>
                <ArrowRight color="currentColor" size={14} />
              </button>
            ))}
          </div>
          <div className="ct-presence-panel" id="ct-presence-panel" role="tabpanel" aria-labelledby={`ct-place-tab-${activeIndex}`} aria-live="polite">
            <span className="ct-presence-panel-index">0{activeIndex + 1} / 03 · {active.region}</span>
            <h3>{active.city}</h3>
            <div>{active.kind}</div>
            <p>{active.detail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function getInitialPath() {
  if (typeof window === 'undefined') return 'student';
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const mentor = params.get('mentor');
  if (mentor && getMentor(mentor)) return 'student';
  return PATHS.some((path) => path.id === type || (type === 'support' && path.id === 'partner')) ? (type === 'support' ? 'partner' : type) : 'student';
}

function buildMailto(path, values, selectedMentor) {
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Phone / WhatsApp: ${values.phone || 'Not provided'}`,
    `Reason: ${path.subject}`,
    selectedMentor ? `Selected mentor: ${selectedMentor.name}` : 'Mentor preference: CA360 to recommend',
    '',
    values.message,
  ].join('\n');
  return `mailto:hello@careerarcadia360.org?subject=${encodeURIComponent(`CA360 · ${path.subject}`)}&body=${encodeURIComponent(body)}`;
}

function PathCard({ path, active, onSelect, index }) {
  return (
    <button
      type="button"
      className={'ct-path' + (active ? ' is-active' : '')}
      role="radio"
      aria-checked={active}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(path.id)}
      id={`ct-path-${path.id}`}
      onKeyDown={(event) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
        const nextId = PATHS[(index + delta + PATHS.length) % PATHS.length].id;
        onSelect(nextId);
        window.requestAnimationFrame(() => document.getElementById(`ct-path-${nextId}`)?.focus());
      }}
    >
      <span className="ct-path-number">{path.number}</span>
      <span className="ct-path-copy">
        <span className="ct-path-eyebrow">{path.eyebrow}</span>
        <span className="ct-path-title">{path.title}</span>
        <span className="ct-path-description">{path.description}</span>
      </span>
      <span className="ct-path-arrow" aria-hidden="true"><ArrowRight color="currentColor" size={17} /></span>
    </button>
  );
}

function ContactForm({ path, selectedMentor, onSuccess }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [error, setError] = useState('');
  const [mailtoHref, setMailtoHref] = useState('');

  useEffect(() => {
    setValues({ name: '', email: '', phone: '', message: '' });
    setError('');
    setMailtoHref('');
  }, [path.id]);

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError('');
  };

  const submit = (event) => {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setError('Please add your name, email, and message so we know how to reply.');
      return;
    }
    const href = buildMailto(path, values, selectedMentor);
    setMailtoHref(href);
    onSuccess(href);
  };

  return (
    <form className="ct-form" onSubmit={submit} noValidate aria-labelledby="ct-form-title">
      <div className="ct-form-head">
        <span className="ct-form-step">REPLY · {path.number}</span>
        <h3 id="ct-form-title" tabIndex="-1">{path.messageLabel}</h3>
        <p>{path.messageHint}</p>
      </div>

      {selectedMentor && (
        <div className="ct-selected-mentor" role="note">
          <span className="ct-selected-mentor-label">REQUESTING AN INTRODUCTION TO</span>
          <strong>{selectedMentor.name}</strong>
          <span>{selectedMentor.field} · {selectedMentor.role}</span>
          <a href={`/mentorship/${selectedMentor.slug}`}>Review profile <ArrowRight color="currentColor" size={13} /></a>
        </div>
      )}

      <div className="ct-field">
        <label htmlFor="ct-name">Full name <span aria-hidden="true">*</span></label>
        <input id="ct-name" name="name" type="text" autoComplete="name" value={values.name} onChange={update('name')} required />
      </div>
      <div className="ct-field">
        <label htmlFor="ct-email">Email address <span aria-hidden="true">*</span></label>
        <span className="ct-field-help">We will reply here.</span>
        <input id="ct-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update('email')} required />
      </div>
      <div className="ct-field">
        <label htmlFor="ct-phone">Phone or WhatsApp <span className="ct-optional">(optional)</span></label>
        <input id="ct-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update('phone')} />
      </div>
      <div className="ct-field">
        <label htmlFor="ct-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="ct-message" name="message" rows="6" value={values.message} onChange={update('message')} required />
      </div>

      {error && <p className="ct-form-error" role="alert">{error}</p>}
      <p className="ct-form-note">We read every message. Your email app will open with this enquiry ready to send.</p>
      <button className="ct-submit" type="submit">
        Prepare the message <ArrowRight color="#0a1f29" size={16} />
      </button>
      {mailtoHref && <a className="ct-mailto-fallback" href={mailtoHref}>Open email app if it did not open automatically <ArrowRight color="currentColor" size={14} /></a>}
    </form>
  );
}

function SuccessState({ path, mailtoHref, onChangePath }) {
  return (
    <div className="ct-success" role="status" aria-live="polite" tabIndex="-1">
      <span className="ct-success-mark" aria-hidden="true">✦</span>
      <span className="ct-form-step">MESSAGE READY · {path.number}</span>
      <h3>Your conversation has a starting point.</h3>
      <p>Your email app should open with the message addressed to CA360. If it did not, use the button below. We will reply to the email you shared.</p>
      <div className="ct-success-actions">
        <a className="ct-submit" href={mailtoHref}>Open email app <ArrowRight color="#0a1f29" size={16} /></a>
        <button type="button" className="ct-change" onClick={onChangePath}>Choose another reason</button>
      </div>
    </div>
  );
}

export function ContactPage() {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState('student');
  const [selectedMentorSlug, setSelectedMentorSlug] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mailtoHref, setMailtoHref] = useState('');
  const path = useMemo(() => PATHS.find((item) => item.id === activeId) || PATHS[0], [activeId]);
  const selectedMentor = useMemo(() => getMentor(selectedMentorSlug), [selectedMentorSlug]);

  useEffect(() => {
    setActiveId(getInitialPath());
    const mentorSlug = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('mentor') : '';
    if (mentorSlug && getMentor(mentorSlug)) setSelectedMentorSlug(mentorSlug);
  }, []);

  const selectPath = (id) => {
    setActiveId(id);
    setSubmitted(false);
    setMailtoHref('');
    if (id !== 'student') setSelectedMentorSlug('');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('type', id);
      if (id !== 'student') url.searchParams.delete('mentor');
      window.history.replaceState({}, '', url);
    }
    window.requestAnimationFrame(() => document.getElementById('ct-form-title')?.focus());
  };

  const handleSuccess = (href) => {
    setMailtoHref(href);
    setSubmitted(true);
    window.requestAnimationFrame(() => document.querySelector('.ct-success')?.focus());
  };

  return (
    <main className={'contact-page' + (reduced ? ' ct-reduced' : '')}>
      <section className="ct-hero" id="contact-top">
        <div className="ct-hero-left" data-reveal>
          <RouteMarker index="04" label="Contact" context="Start here" />
          <p className="ct-kicker">A NOTE, A QUESTION, A NEXT MOVE.</p>
          <h1>Start the <em>conversation</em>.</h1>
          <p className="ct-hero-dek">Have a question? Good. That is usually where the useful conversation starts.</p>
          <a className="ct-hero-email" href="mailto:hello@careerarcadia360.org">hello@careerarcadia360.org <ArrowRight color="currentColor" size={14} /></a>
        </div>
        <div className="ct-hero-index" data-reveal data-reveal-delay="1" aria-label="Contact page index">
          <span className="ct-index-label">THE CONVERSATION INDEX</span>
          {PATHS.map((item) => <span key={item.id} className={'ct-index-row' + (item.id === activeId ? ' is-active' : '')}><b>{item.number}</b>{item.eyebrow.replace('FOR ', '')}</span>)}
        </div>
      </section>

      <section className="ct-intro" data-reveal aria-labelledby="ct-intro-title">
        <div className="ct-intro-label">CHOOSE YOUR WAY IN</div>
        <div>
          <h2 id="ct-intro-title">Tell us what brought you here.</h2>
          <p>Students, mentors, schools, partners, and curious people all start in a different place. Choose the closest one and we will keep the next step useful.</p>
        </div>
      </section>

      <section className="ct-workspace" aria-label="Start a CA360 conversation">
        <div className="ct-paths" role="radiogroup" aria-label="What are you contacting CA360 about?">
          {PATHS.map((item, index) => <PathCard key={item.id} path={item} index={index} active={item.id === activeId} onSelect={selectPath} />)}
        </div>

        <div className={'ct-reply' + (submitted ? ' is-submitted' : '')}>
          <div className="ct-reply-top">
            <span className="ct-reply-label">CA360 REPLIES</span>
            <span className="ct-reply-line" aria-hidden="true" />
            <span className="ct-reply-path">{path.number} / 04</span>
          </div>
          {!submitted ? (
            <>
              <p className="ct-reply-text" key={path.id}>{path.reply}</p>
              <ContactForm path={path} selectedMentor={selectedMentor} onSuccess={handleSuccess} />
            </>
          ) : (
            <SuccessState path={path} mailtoHref={mailtoHref} onChangePath={() => setSubmitted(false)} />
          )}
        </div>
      </section>

      <GhanaPresence />

      <section className="ct-expect" data-reveal aria-labelledby="ct-expect-title">
        <div className="ct-expect-sign">WHAT HAPPENS NEXT?</div>
        <div className="ct-expect-copy">
          <h2 id="ct-expect-title">You send the question.<br /><em>We find the right door.</em></h2>
          <p>We read every message. When the team confirms the response window, this is where the honest timing will live. Until then, we will not promise a reply time we cannot guarantee.</p>
        </div>
        <div className="ct-direct">
          <span>Prefer direct?</span>
          <a href="mailto:hello@careerarcadia360.org">Email hello@careerarcadia360.org <ArrowRight color="currentColor" size={14} /></a>
        </div>
      </section>

      <section className="ct-close" data-reveal>
        <p>Every good path starts with a question.</p>
        <a href="/about">Meet the people behind CA360 <ArrowRight color="currentColor" size={14} /></a>
      </section>
    </main>
  );
}
