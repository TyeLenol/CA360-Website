"use client";

import { useState, useEffect, useRef } from 'react';
import { useScrollProgress } from '../../hooks/ui-hooks';
import { PhotoPlaceholder } from '../shared/Placeholders';
import { ArrowLeft, ArrowRight } from '../shared/Icons';

/* ── DATA ──────────────────────────────────────────────────*/

const ALBUM_PHOTOS = {
  1: [
    { id: 'a1p1', name: 'Ama Mensah',  field: 'Medicine Student', tone: 'teal',   caption: 'She had 14 questions ready before the session even started.' },
    { id: 'a1p2', name: 'Dr. Owusu',   field: 'Lead Mentor',      tone: 'deep',   caption: 'Walking the group through a real patient intake scenario.' },
    { id: 'a1p3', name: 'The Room',    field: 'Session 01',       tone: 'soft',   caption: 'Eight students, three doctors, four hours that refused to end.' },
    { id: 'a1p4', name: 'Kofi Asante', field: 'Medicine Student', tone: 'teal',   caption: 'Asking the question everyone else was afraid to ask.' },
  ],
  2: [
    { id: 'a2p1', name: 'Opening Circle',  field: 'Community Day',  tone: 'orange', caption: 'Every student introduced themselves and one thing they were afraid of.' },
    { id: 'a2p2', name: 'Group Work',      field: 'Workshop',       tone: 'warm',   caption: 'Teams mapping career paths across four fields on A1 paper.' },
    { id: 'a2p3', name: 'Closing Session', field: 'Community',      tone: 'orange', caption: 'The moment the room decided to build something together.' },
  ],
  3: [
    { id: 'a3p1', name: 'Dr. Owusu',     field: 'Medicine Lead',    tone: 'deep',   caption: 'Seven years as a physician. Joined CA360 because someone once did the same for him.' },
    { id: 'a3p2', name: 'Efua Darko',    field: 'Law Guide',        tone: 'soft',   caption: 'Reading law when everyone said she should study business.' },
    { id: 'a3p3', name: 'Kwame Boateng', field: 'Engineering Guide', tone: 'teal',  caption: 'Built his first circuit at 12. Now guides the next generation.' },
  ],
  4: [
    { id: 'a4p1', name: 'Kumasi Visit', field: 'School Outreach', tone: 'teal',   caption: '60 SHS-3 students and a room that went very quiet when the mentors walked in.' },
    { id: 'a4p2', name: 'Q&A Floor',   field: 'Session',         tone: 'deep',   caption: 'Every hand in the room was up by the time we reached the careers section.' },
    { id: 'a4p3', name: 'After',       field: 'Community',       tone: 'soft',   caption: 'Conversations that kept going long after the session officially ended.' },
  ],
  5: [
    { id: 'a5p1', name: 'Closing Circle',   field: 'Cohort 1',  tone: 'warm',   caption: 'The same students who showed up uncertain in January.' },
    { id: 'a5p2', name: 'Certificates',     field: 'Ceremony',  tone: 'orange', caption: 'Each one earned. Each one a reminder that this is just the beginning.' },
    { id: 'a5p3', name: 'The Team',         field: 'CA360',     tone: 'teal',   caption: 'The people who made Cohort 1 possible — mentors, organisers, believers.' },
    { id: 'a5p4', name: 'Last Photo',       field: 'Cohort 1',  tone: 'deep',   caption: 'Someone asked for one last photo. Nobody moved for a while after.' },
  ],
};

const ALBUMS = [
  {
    id: 1, label: 'Medicine Track', desc: 'Session 01 — Jan 2025',
    pair: 'Dr. Owusu & Ama Mensah', tone: 'teal',
    context: 'Three doctors. Eight students. One afternoon in January that refused to end at the scheduled time. This was the session where we learned that the questions students carry are not small ones — and that the right room can hold all of them.',
  },
  {
    id: 2, label: 'Community Day', desc: 'Feb 2025 — Accra',
    pair: '45 Students · 12 Mentors', tone: 'orange',
    context: 'We brought forty-five students and twelve mentors into the same room in Accra and gave them one brief: figure out where you are going. What happened over those five hours became the foundation for everything CA360 has done since.',
  },
  {
    id: 3, label: 'Mentor Portraits', desc: 'Cohort 1 — 2025',
    pair: 'The Guides', tone: 'soft',
    context: 'The people behind the sessions. Each mentor in Cohort 1 volunteered not because it was easy to find the time, but because someone once did the same for them. These are their portraits.',
  },
  {
    id: 4, label: 'School Visit', desc: 'Mar 2025 — Kumasi',
    pair: 'SHS Outreach Day', tone: 'deep',
    context: 'Sixty SHS-3 students at Komfo Anokye Senior High who had never been in a room like this one. The visit lasted three hours. The conversations in the corridor after lasted longer.',
  },
  {
    id: 5, label: 'Closing Ceremony', desc: 'Session 03 — May 2025',
    pair: 'Cohort 1 Graduates', tone: 'warm',
    context: 'Cohort 1 started as strangers in January. By May they were something else entirely. The closing ceremony was not a formality — it was the first time most of them had been celebrated for choosing to show up.',
  },
];

const TILES = [
  { id: 1, name: 'Ama Mensah',       field: 'Medicine',  desc: 'Session 01 — Jan 2025',  cat: 'sessions',  tone: 'teal',   tall: true,  caption: 'First to raise her hand. Last to leave.' },
  { id: 2, name: 'Community Day',    field: 'Community', desc: 'Feb 2025 — Accra',        cat: 'community', tone: 'orange', tall: false, caption: '45 students, 12 mentors, one afternoon.' },
  { id: 3, name: 'Dr. Owusu',        field: 'Mentor',    desc: 'Cohort 1 Lead',           cat: 'portraits', tone: 'deep',   tall: false, caption: 'Seven years as a physician. Here by choice.' },
  { id: 4, name: 'Kofi Asante',      field: 'Medicine',  desc: 'Session 01',              cat: 'sessions',  tone: 'soft',   tall: true,  caption: 'Asked the question everyone else was afraid to.' },
  { id: 5, name: 'Efua Darko',       field: 'Mentor',    desc: 'Law Track Guide',         cat: 'portraits', tone: 'warm',   tall: false, caption: 'Read law when everyone said study business.' },
  { id: 6, name: 'School Visit',     field: 'Outreach',  desc: 'Mar 2025 — Kumasi',       cat: 'community', tone: 'teal',   tall: false, caption: 'A room that went very quiet.' },
  { id: 7, name: 'Abena Ofori',      field: 'Medicine',  desc: 'Session 02',              cat: 'sessions',  tone: 'orange', tall: true,  caption: 'Showed up to every session before the mentors.' },
  { id: 8, name: 'Kwame Boateng',    field: 'Mentor',    desc: 'Engineering Guide',       cat: 'portraits', tone: 'deep',   tall: false, caption: 'Built his first circuit at 12.' },
  { id: 9, name: 'Closing Ceremony', field: 'Community', desc: 'May 2025 — Cohort 1',     cat: 'community', tone: 'soft',   tall: false, caption: 'Nobody moved for a while after the last photo.' },
];

const STORIES = [
  { id: 1, tag: 'Session Recap', tone: 'teal',   caption: 'Our first Medicine session brought 8 students and 3 doctors together for an afternoon that changed perspectives.' },
  { id: 2, tag: 'Community',     tone: 'orange', caption: 'Community Day in Accra: 45 students, 12 mentors, one goal — clarity about the path ahead.' },
  { id: 3, tag: 'School Visit',  tone: 'deep',   caption: 'A visit to Komfo Anokye SHS planted seeds for the next generation of professionals.' },
];

const FILTERS = [
  { key: 'all',       label: 'ALL'       },
  { key: 'sessions',  label: 'SESSIONS'  },
  { key: 'community', label: 'COMMUNITY' },
  { key: 'portraits', label: 'PORTRAITS' },
];

/* ── SHARED arrive() ────────────────────────────────────── */

function makeArrive(prog) {
  return function arrive(lo, hi, dy = 48) {
    const t = Math.max(0, Math.min(1, (prog - lo) / Math.max(hi - lo, 0.001)));
    const e = t * t * (3 - 2 * t);
    return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
  };
}

/* ══════════════════════════════════════════════════════════
   LIGHTBOX — full-screen single photo, arrow navigation
   ══════════════════════════════════════════════════════════ */
function Lightbox({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const photo = photos[idx];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx(i => Math.min(photos.length - 1, i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photos.length, onClose]);

  return (
    <div className="glbx-overlay">
      <div className="glbx-stage">
        {/* top bar */}
        <div className="glbx-header">
          <span className="glbx-counter">
            {String(idx + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
          <button className="glbx-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* photo — key re-mounts for animation on change */}
        <div className="glbx-photo-wrap" key={photo.id}>
          <PhotoPlaceholder tone={photo.tone} label={photo.name} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Fraunces italic caption */}
        <div className="glbx-caption">
          <div className="glbx-caption-name">{photo.name}</div>
          <div className="glbx-caption-field">{photo.field}</div>
          {photo.caption && <p className="glbx-caption-text">{photo.caption}</p>}
        </div>

        {/* prev / next */}
        {idx > 0 && (
          <button className="glbx-arrow glbx-arrow--prev" onClick={(e) => { e.stopPropagation(); setIdx(i => i - 1); }} aria-label="Previous">
            <ArrowLeft color="#fff" size={20} />
          </button>
        )}
        {idx < photos.length - 1 && (
          <button className="glbx-arrow glbx-arrow--next" onClick={(e) => { e.stopPropagation(); setIdx(i => i + 1); }} aria-label="Next">
            <ArrowRight color="#fff" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ALBUM OVERLAY — editorial split: dark header + photo grid
   Clips open from top like a page being pulled down.
   ══════════════════════════════════════════════════════════ */
function AlbumOverlay({ album, onClose, onPhotoClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const photos = ALBUM_PHOTOS[album.id] || [];

  // one-frame delay to trigger CSS clip-path transition
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 560);
  };

  return (
    <div className="galb-overlay">
      {/* blurred dim behind the panel */}
      <div className="galb-backdrop" onClick={handleClose} />

      <div className={`galb-panel${isOpen ? ' is-open' : ''}`}>

        {/* ── dark editorial header ── */}
        <div className="galb-header">
          <div className="galb-meta">{album.desc} · {album.pair}</div>
          <h2 className="galb-title">{album.label}</h2>
          <p className="galb-context">{album.context}</p>
          <button className="galb-close" onClick={handleClose} aria-label="Close">×</button>
        </div>

        {/* ── photo grid ── */}
        <div className="galb-grid-wrap">
          <div className="galb-grid">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="galb-photo-tile"
                onClick={() => onPhotoClick(photos, i)}
              >
                <PhotoPlaceholder tone={photo.tone} label={photo.name} style={{ width: '100%', height: '100%' }} />
                <div className="galb-photo-hover">
                  <div className="galb-photo-name">{photo.name}</div>
                  <div className="galb-photo-caption">{photo.field}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO — dark mosaic wall, CSS-animated title, scroll cue
   ══════════════════════════════════════════════════════════ */
function GalleryHero() {
  const ref    = useRef(null);
  const prog   = useScrollProgress(ref);
  const arrive = makeArrive(prog);

  const bgScale    = 1 + prog * 0.07;
  const cueOpacity = 1 - Math.max(0, Math.min(1, (prog - 0.60) / 0.20));

  return (
    <section className="gh-hero" ref={ref}>
      <div className="gh-hero-sticky">
        <div className="gh-hero-bgrid" style={{ transform: `scale(${bgScale})` }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`gh-bgtile gh-bgtile--${i}`} />
          ))}
        </div>
        <div className="gh-hero-veil" />

        <div className="gh-hero-inner">
          <div className="gh-hero-eyebrow" style={arrive(0.0, 0.22, 20)}>
            Gallery — Career Arcadia 360
          </div>
          <h1 className="gh-hero-title">The Moments.</h1>
          <p className="gh-hero-sub" style={arrive(0.08, 0.30, 32)}>
            Real sessions. Real people. Real change.
          </p>
        </div>

        <div className="gh-hero-cue" style={{ opacity: cueOpacity }}>
          <span>Scroll to explore</span>
          <div className="gh-cue-track">
            <div className="gh-cue-thumb" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FILMSTRIP — Ahadi numbered counter × BBBS named pairs
   Horizontal rail driven by vertical scroll.
   Click a tile → open its album overlay.
   ══════════════════════════════════════════════════════════ */
function GalleryFilmstrip({ onAlbumClick }) {
  const ref     = useRef(null);
  const tileRef = useRef(null);
  const prog    = useScrollProgress(ref);
  const [tileStep, setTileStep] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (tileRef.current) setTileStep(tileRef.current.offsetWidth + 24);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const translateX = tileStep > 0 ? -prog * (ALBUMS.length - 1) * tileStep : 0;
  const activeIdx  = Math.min(ALBUMS.length - 1, Math.round(prog * (ALBUMS.length - 1)));

  return (
    <section className="gstrip-wrap" ref={ref}>
      <div className="gstrip-sticky">
        <div className="gstrip-header">
          <div className="gstrip-section-label" data-reveal>01 — THE ALBUMS</div>
          <div className="gstrip-counter">
            <span className="gstrip-counter-active">{String(activeIdx + 1).padStart(2, '0')}</span>
            <span className="gstrip-counter-sep"> / </span>
            {String(ALBUMS.length).padStart(2, '0')}
          </div>
        </div>

        <div className="gstrip-viewport">
          <div className="gstrip-rail" style={{ transform: `translateX(${translateX}px)` }}>
            {ALBUMS.map((album, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={album.id}
                  ref={i === 0 ? tileRef : null}
                  className={`gstrip-tile${isActive ? ' is-active' : ''}`}
                  onClick={() => onAlbumClick(album)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="gstrip-tile-photo">
                    <PhotoPlaceholder tone={album.tone} label={album.label} style={{ width: '100%', height: '100%' }} />
                    <span className="gstrip-tile-num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="gstrip-tile-foot">
                    <div className="gstrip-tile-albumname">{album.label}</div>
                    <div className="gstrip-tile-meta">
                      <span className="gstrip-tile-desc">{album.desc}</span>
                      <span className="gstrip-tile-dot" />
                      <span className="gstrip-tile-pair">{album.pair}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="gstrip-progress-bar">
          <div className="gstrip-progress-fill" style={{ width: `${prog * 100}%` }} />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   GRID — dark section, filter tabs, staggered reveals
   Click a tile → open lightbox directly.
   ══════════════════════════════════════════════════════════ */
function GalleryGrid({ onPhotoClick }) {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? TILES : TILES.filter(t => t.cat === filter);

  return (
    <section className="ggrid-section">
      <div className="ggrid-filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`ggrid-filter-btn${filter === f.key ? ' is-active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ggrid-mosaic">
        {shown.map((tile, i) => (
          <div
            key={tile.id}
            className={`ggrid-tile${tile.tall ? ' is-tall' : ''}`}
            data-reveal
            style={{ transitionDelay: `${(i % 3) * 80}ms`, cursor: 'pointer' }}
            onClick={() => onPhotoClick(shown, i)}
          >
            <div className="ggrid-tile-photo">
              <PhotoPlaceholder tone={tile.tone} label={tile.name} style={{ width: '100%', height: '100%' }} />
              <div className="ggrid-tile-hover">
                <div className="ggrid-hover-name">{tile.name}</div>
                <div className="ggrid-hover-field">{tile.field}</div>
              </div>
            </div>
            <div className="ggrid-tile-foot">
              <span className="ggrid-tile-desc">{tile.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURED — full-bleed photo scales toward camera,
   dark overlay fades in, BBBS named-pair quote arrives.
   ══════════════════════════════════════════════════════════ */
function GalleryFeatured() {
  const ref    = useRef(null);
  const prog   = useScrollProgress(ref);
  const arrive = makeArrive(prog);

  const photoScale     = 0.88 + prog * 0.14;
  const overlayOpacity = Math.max(0, Math.min(1, (prog - 0.26) / 0.24));

  return (
    <section className="gfeat-wrap" ref={ref}>
      <div className="gfeat-sticky">
        <div className="gfeat-photo" style={{ transform: `scale(${photoScale})` }}>
          <PhotoPlaceholder tone="deep" label="Featured Moment" style={{ width: '100%', height: '100%' }} />
          <div className="gfeat-overlay" style={{ opacity: overlayOpacity }} />
          <div className="gfeat-quote-block" style={{ opacity: overlayOpacity }}>
            <blockquote className="gfeat-quote" style={arrive(0.42, 0.70, 40)}>
              "She showed me what was possible."
            </blockquote>
            <div className="gfeat-attrib" style={arrive(0.60, 0.82, 22)}>
              — Ama Mensah, Medicine Track · Cohort 1
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   STORIES — Ahadi stacked cards: image + tag + caption
   ══════════════════════════════════════════════════════════ */
function GalleryStories() {
  return (
    <section className="gstories-section">
      <div className="gstories-header" data-reveal>
        <div className="gstories-eyebrow">02 — STORIES</div>
        <h2 className="gstories-title">Moments in context.</h2>
      </div>
      <div className="gstories-grid">
        {STORIES.map((s, i) => (
          <div key={s.id} className="gstory-card" data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="gstory-img">
              <PhotoPlaceholder tone={s.tone} label={s.tag} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="gstory-body">
              <span className="gstory-tag">{s.tag}</span>
              <p className="gstory-caption">{s.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   CTA
   ══════════════════════════════════════════════════════════ */
function GalleryCTA() {
  return (
    <section className="gcta-section">
      <div className="gcta-inner" data-reveal>
        <div className="gcta-eyebrow">Join the story</div>
        <h2 className="gcta-title">Be in the next photo.</h2>
        <p className="gcta-sub">Attend a session. Become a mentor. Show up.</p>
        <a className="gcta-btn" href="/#join">Apply Now</a>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE — manages overlay state, scroll lock
   ══════════════════════════════════════════════════════════ */
export function GalleryPage() {
  const [openAlbum, setOpenAlbum] = useState(null);
  const [lightbox,  setLightbox]  = useState(null); // { photos, index }

  // scroll lock when any overlay is open
  useEffect(() => {
    document.body.style.overflow = (openAlbum || lightbox) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openAlbum, lightbox]);

  const openLightbox = (photos, index) => {
    setLightbox({ photos, index });
  };

  return (
    <main className="gallery-page">
      <GalleryHero />
      <GalleryFilmstrip onAlbumClick={(album) => setOpenAlbum(album)} />
      <GalleryGrid onPhotoClick={openLightbox} />
      <GalleryFeatured />
      <GalleryCTA />

      {openAlbum && (
        <AlbumOverlay
          album={openAlbum}
          onClose={() => setOpenAlbum(null)}
          onPhotoClick={openLightbox}
        />
      )}

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  );
}
