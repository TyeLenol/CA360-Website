"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, PinIcon } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { RouteMarker } from '../shared/RouteMarker';
import { useScrollProgress } from '../../hooks/ui-hooks';

/* ===== LOCAL HOOK — element-relative scroll progress ===== */
function useElementScroll(ref) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const wh = window.innerHeight;
        const center = r.top + r.height / 2;
        const offset = (wh / 2 - center) / wh;
        setV(Math.max(-1.5, Math.min(1.5, offset)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return v;
}

/* ===== DATA ===== */
const ARTICLES = [
  { id: 'a1', featured: true, cat: 'mentor', catLabel: 'MENTOR STORY',
    title: 'The white coat, unmasked: a year inside the ward.',
    excerpt: 'Three house officers walked our biggest cohort yet through their first 12 months on the ward — the wins, the burnout, and the moments they almost quit. Plus the seven questions that broke the room.',
    author: 'Dr. A. Asare', authorSeed: 1, authorRole: 'Founder · CA360', date: 'FEB 28, 2026', readTime: '8 min read',
    venue: 'University of Ghana Medical School · Korle Bu', tone: 'teal', label: 'INTERVIEW · KORLE BU' },
  { id: 'a2', cat: 'mentor', catLabel: 'FOUNDER ESSAY',
    title: 'A letter to the SHS-3 girl I was.',
    excerpt: "On picking a career by elimination, the older sister I didn't have, and the kind of advice I would have actually heard at 17.",
    author: 'Dr. A. Asare', authorSeed: 1, authorRole: 'Founder · CA360', date: 'FEB 14, 2026', readTime: '5 min',
    tone: 'warm', label: 'ESSAY' },
  { id: 'a3', cat: 'news', catLabel: 'NEWS & UPDATES',
    title: 'Why we delayed the Law track — and what that taught us.',
    excerpt: "We almost shipped a Law cohort before we had the mentors to back it up. Here's why we pulled the plug, and the rule we made afterwards.",
    author: 'CA360 Team', authorSeed: 7, authorRole: 'CA360 Editorial', date: 'JAN 30, 2026', readTime: '3 min',
    tone: 'orange', label: 'INTERNAL' },
  { id: 'a4', cat: 'student', catLabel: 'STUDENT STORY',
    title: 'How Akua got into UG Law without a debate coach.',
    excerpt: 'Six rejections, one acceptance, and a lot of YouTube debate replays. A first-person account from one of our SHS alumni.',
    author: 'Akua Boateng', authorSeed: 3, authorRole: 'CA360 Alumna', date: 'JAN 18, 2026', readTime: '6 min',
    tone: 'deep', label: 'CLASS OF 2025' },
  { id: 'a5', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'The four books Dr. Mensah wishes someone gave him at 17.',
    excerpt: 'Two on career navigation, one on self-awareness, one that has nothing to do with work. With links and a one-paragraph reason for each.',
    author: 'Dr. K. Mensah', authorSeed: 2, authorRole: 'Surgery Resident · KATH', date: 'JAN 09, 2026', readTime: '4 min',
    tone: 'cream', label: 'READING LIST' },
  { id: 'a6', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'Medicine, by the numbers: who actually gets in?',
    excerpt: "A look at admissions data across UGMS, KNUST and UCC over the last five intake cycles — and what it means for next year's applicants.",
    author: 'CA360 Research', authorSeed: 4, authorRole: 'CA360 Research', date: 'DEC 21, 2025', readTime: '9 min',
    tone: 'teal', label: 'DATA · ANNUAL' },
  { id: 'a7', cat: 'mentor', catLabel: 'MENTOR STORY',
    title: "Three mentors on the rejection they almost didn't recover from.",
    excerpt: "A residency that almost wasn't. A law school no. A grad scheme that came down to one phone call. Three stories, three reframes.",
    author: 'Esi Adjei', authorSeed: 6, authorRole: 'Paediatrics House Officer', date: 'DEC 12, 2025', readTime: '7 min',
    tone: 'warm', label: 'INTERVIEWS · 03' },
  { id: 'a8', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'Five questions to ask before you commit to a course.',
    excerpt: 'The ones that would have saved a lot of people a lot of confusion — and the answers you should actually demand before signing anything.',
    author: 'CA360 Team', authorSeed: 7, authorRole: 'CA360 Editorial', date: 'NOV 28, 2025', readTime: '5 min',
    tone: 'orange', label: 'CAREER PREP' },
];

const CATEGORIES = [
  { id: 'all',     label: 'All articles' },
  { id: 'student', label: 'Student stories' },
  { id: 'mentor',  label: 'Mentor stories' },
  { id: 'guide',   label: 'Career guides' },
  { id: 'news',    label: 'News & updates' },
];

/* ===== JOURNAL HERO ===== */
function JournalHero() {

  return (
    <section className="jh-hero" id="journal-top">
      <div className="jh-hero-sticky">
        <div className="jh-hero-top">
          <RouteMarker label="Journal" context="stories, guides, honest takes" />
          <div className="jh-hero-side" data-reveal data-reveal-delay="1">
            A journal on mentorship,<br />
            <em>careers, and the life after SHS.</em>
          </div>
        </div>

        {/* Title visible immediately on load — CSS animation, not scroll-gated */}
        <div className="jh-hero-title-wrap">
          <h1 className="jh-hero-title">
            The <em className="jh-hero-em">
              Journal
              <svg className="jh-hero-scribble" viewBox="0 0 160 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 10 C 30 4, 70 13, 110 7 S 148 12, 158 8" stroke="#d68307" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </em>
          </h1>
        </div>

        {/* Metric + statement — scroll-animated on desktop, always visible on mobile */}
        <div className="jh-hero-lower">
          <div className="jh-hero-metric">
            <div className="jh-hero-metric-label">ON THE SHELF</div>
            <div className="jh-hero-metric-num">{ARTICLES.length}</div>
            <div className="jh-hero-metric-suf">articles</div>
          </div>

          <div className="jh-hero-statement-row">
            <p className="jh-hero-statement">
              Stories, guides, and honest takes for the path after <em>SHS</em> — from people who have already walked it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== FEATURED ARTICLE ===== */
function JournalFeatured({ article, onOpen }) {
  const secRef = useRef(null);
  const scroll = useElementScroll(secRef);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const imgY = isMobile ? 0 : scroll * -42;

  return (
    <section className="jf-sec" id="journal-featured" ref={secRef}>
      <div className="jf-sticky">
        <div className="jf-eyebrow" data-reveal>
          <span className="jf-eyebrow-mark">★</span>
          A good place to begin · Featured story
          <span className="jf-eyebrow-rule" />
        </div>
        <article className="jf-card">
          {/* Image arrives first */}
          <div className="jf-img">
            <div className="jf-img-inner" style={{ transform: `translate3d(0, ${imgY.toFixed(1)}px, 0)` }}>
              <PhotoPlaceholder tone={article.tone} label={article.label} style={{ width: '100%', height: '100%' }} />
            </div>
            <span className="jf-img-cat">{article.catLabel}</span>
          </div>

          {/* Text body — meta + title then blurb then rest */}
          <div className="jf-body">
            <div className="jf-meta">
              <span>{article.date}</span>
              <span className="dot" />
              <span>{article.readTime}</span>
              <span className="dot" />
              <span>{article.author.toUpperCase()}</span>
            </div>
            <h2 className="jf-title">{article.title}</h2>
            <p className="jf-excerpt">{article.excerpt}</p>

            {article.venue && (
              <div className="jf-venue">
                <PinIcon size={14} color="#d68307" />
                Hosted at <span>{article.venue}</span>
              </div>
            )}

            <div className="jf-foot">
              <div className="jf-author">
                <div className="jf-author-avatar">
                  <PhotoPlaceholder tone="warm" label="" style={{ width: '100%', height: '100%' }}>
                    <Portrait seed={article.authorSeed} bg="transparent" tone="#d68307" />
                  </PhotoPlaceholder>
                </div>
                <div>
                  <div className="jf-author-name">{article.author}</div>
                  <div className="jf-author-role">{article.authorRole}</div>
                </div>
              </div>
              <a
                className="jf-cta"
                href={`/journal#${article.id}`}
                onClick={(e) => { e.preventDefault(); onOpen(article); }}
              >
                Open story preview
                <span className="jf-cta-arrow"><ArrowRight color="#fff" size={16} /></span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ===== FILTER BAR (integrated into grid header) ===== */
function JournalFilter({ filter, onFilter }) {
  const tabRefs = useRef([]);

  const moveTab = (event, index) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = (index + delta + CATEGORIES.length) % CATEGORIES.length;
    tabRefs.current[next]?.focus();
    onFilter(CATEGORIES[next].id);
  };

  return (
    <div className="jfilter-bar" role="tablist" aria-label="Filter journal stories">
      {CATEGORIES.map((c, index) => (
        <button
          key={c.id}
          ref={(node) => { tabRefs.current[index] = node; }}
          id={`journal-filter-${c.id}`}
          className={'jfilter-tab' + (filter === c.id ? ' is-active' : '')}
          onClick={() => onFilter(c.id)}
          onKeyDown={(event) => moveTab(event, index)}
          role="tab"
          aria-selected={filter === c.id}
          aria-controls="journal-grid-list"
          tabIndex={filter === c.id ? 0 : -1}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

/* ===== ARTICLE CARD ===== */
function ArticleCard({ article, index, onOpen }) {
  return (
    <article className="jcard" data-reveal data-reveal-delay={index % 2}>
      <a
        className="jcard-link"
        href={`/journal#${article.id}`}
        onClick={(e) => { e.preventDefault(); onOpen(article); }}
      >
        <div className="jcard-img">
          <PhotoPlaceholder tone={article.tone} label={article.label} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="jcard-body">
          <div className="jcard-label">{article.catLabel}</div>
          <h3 className="jcard-title">{article.title}</h3>
          <p className="jcard-excerpt">{article.excerpt}</p>
                      <div className="jcard-foot">
              <span className="jcard-read">OPEN PREVIEW</span>



            <span className="jcard-meta">
              <span>{article.date}</span>
              <span className="jcard-meta-sep">·</span>
              <span>{article.readTime}</span>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

/* ===== READING ROOM ===== */
function JournalReader({ article, onClose }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div className="jreader" role="dialog" aria-modal="true" aria-labelledby="jreader-title">
      <button className="jreader-backdrop" aria-label="Close article" onClick={onClose} />
      <article className="jreader-panel" ref={panelRef}>
        <div className="jreader-topline">
          <span>STORY PREVIEW · {article.catLabel}</span>
          <button ref={closeRef} className="jreader-close" onClick={onClose} aria-label="Close article">
            CLOSE <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="jreader-body">
          <div className="jreader-kicker">{article.date} · {article.readTime}</div>
          <h2 id="jreader-title">{article.title}</h2>
          <div className="jreader-author">
            <Portrait seed={article.authorSeed} bg="transparent" tone="#d68307" />
            <span>{article.author} · {article.authorRole}</span>
          </div>
          <p className="jreader-excerpt">{article.excerpt}</p>
          <div className="jreader-next">
            <span className="jreader-next-label">KEEP GOING</span>
            <strong>One story should lead to another.</strong>
            <p>Use this preview to find your next question, then keep exploring the Journal.</p>
            <div className="jreader-actions">
              <a className="btn btn-primary" href="/#opportunity" onClick={onClose}>
                See what&apos;s open <ArrowRight color="#0a1f29" size={14} />
              </a>
              <a className="jreader-secondary" href="#journal-letter" onClick={onClose}>
                Get the monthly letter <ArrowRight color="#0a1f29" size={14} />
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ===== GRID ===== */
function JournalGrid({ articles, filter, onFilter, onOpen }) {
  const categoryLabel = CATEGORIES.find((c) => c.id === filter)?.label || 'All articles';
  const visibleCount = filter === 'all' ? articles.length + 1 : articles.length;

  return (
    <section className="jgrid-sec" id="journal-grid" aria-labelledby="journal-grid-title">
      <div className="jgrid-header">
        <div className="jgrid-header-copy">
          <div>
            <span className="jgrid-kicker">{filter === 'all' ? 'THE FULL SHELF' : 'FILTERED SHELF'}</span>
            <h2 id="journal-grid-title">The archive, <em>in full.</em></h2>
            <p>{filter === 'all' ? 'Browse every story, guide, and honest take.' : `Showing ${visibleCount} ${categoryLabel.toLowerCase()}.`}</p>
          </div>
          <strong className="jgrid-count"><span>{visibleCount}</span> {filter === 'all' ? 'stories' : categoryLabel.toLowerCase()}</strong>
        </div>
        <JournalFilter filter={filter} onFilter={onFilter} />
      </div>
      <div className="jgrid" id="journal-grid-list" role="tabpanel" aria-labelledby="journal-grid-title" aria-live="polite">
        {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i} onOpen={onOpen} />)}
      </div>
    </section>
  );
}

/* ===== LETTERS TO NEWSLETTER TRANSITION ===== */
function JournalLettersTransition() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const pathRef = useRef(null);
  const [planePos, setPlanePos] = useState({ x: 0, y: 0, angle: 0, len: 1 });
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [deepLinked, setDeepLinked] = useState(false);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPlanePos((p) => ({ ...p, len }));
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    const syncHash = () => setDeepLinked(window.location.hash === '#journal-letter');
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    const flightP = reducedMotion ? 1 : Math.max(0, Math.min(1, prog / 0.54));
    const pt = pathRef.current.getPointAtLength(flightP * len);
    const ptAhead = pathRef.current.getPointAtLength(Math.min(len, flightP * len + 6));
    const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * 180 / Math.PI;
    setPlanePos({ x: pt.x, y: pt.y, angle, len });
  }, [prog, reducedMotion]);

  const clamp = (value) => Math.max(0, Math.min(1, value));
  const flightP = reducedMotion ? 1 : clamp(prog / 0.54);
  const morphP = reducedMotion ? 1 : clamp((prog - 0.46) / 0.24);
  const forcedNewsletter = deepLinked || reducedMotion;
  const visualMorphP = forcedNewsletter ? 1 : morphP;
  const lettersP = forcedNewsletter ? 0 : clamp(1 - morphP * 1.55);
  const newsletterP = forcedNewsletter ? 1 : clamp((morphP - 0.28) / 0.55);
  const newsletterReady = forcedNewsletter || morphP > 0.62;
  const lettersTone = visualMorphP > 0.5 ? '#0a1f29' : '#fef9ee';
  const trail = flightP * planePos.len;
  const titleY = (1 - lettersP) * -32;
  const newsletterY = (1 - newsletterP) * 22;

  const submit = (e) => {
    e.preventDefault();
    if (/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 4000);
    }
  };

  return (
    <section className="jdrift" id="journal-letter" ref={ref} aria-labelledby="jdrift-title" aria-describedby="jdrift-copy">
      <div className="jdrift-sticky">
        <div className="jdrift-orange-flood" style={{ opacity: visualMorphP }} aria-hidden="true" />
        <svg className="jdrift-flight" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
          <path
            ref={pathRef}
            className="jdrift-flight-path"
            d="M -40 480 C 200 460, 280 200, 480 250 S 800 460, 980 280 S 1200 80, 1280 60"
            fill="none" stroke="#fef9ee" strokeWidth="1.8" strokeLinecap="round"
            strokeDasharray="4 8"
            style={{ strokeDashoffset: (planePos.len - trail).toFixed(1), opacity: lettersP }}
          />
          {planePos.len > 1 && lettersP > 0 && (
            <g
              className="jdrift-plane"
              transform={`translate(${planePos.x.toFixed(1)} ${planePos.y.toFixed(1)}) rotate(${planePos.angle.toFixed(1)})`}
            >
              <path d="M -16 -10 L 22 0 L -16 10 L -8 0 Z"
                    fill="#fef9ee" stroke="#0a1f29" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M -16 -10 L -8 0 L -16 10"
                    fill="none" stroke="#0a1f29" strokeWidth="1.2" strokeLinejoin="round" />
              <line x1="-8" y1="0" x2="22" y2="0" stroke="#0a1f29" strokeWidth="0.9" opacity="0.6" />
            </g>
          )}
        </svg>

        <div className="jdrift-titles" style={{ opacity: lettersP, transform: `translate3d(0, ${titleY.toFixed(1)}px, 0)`, color: lettersTone }}>
          <h2 className="jdrift-title" id="jdrift-title"><em>Letters.</em></h2>
          <p className="jdrift-sub" id="jdrift-copy">Don&apos;t miss a single one.</p>
        </div>

        <div
          className="jdrift-newsletter-layer"
          style={{ opacity: newsletterP, transform: `translate3d(0, ${newsletterY.toFixed(1)}px, 0)`, pointerEvents: newsletterReady ? 'auto' : 'none' }}
          aria-hidden={!newsletterReady}
        >
          <article className="jnews-inset" aria-labelledby="journal-letter-title">
            <div className="jnews-inset-body">
              <div className="jnews-inset-tag">DON&apos;T MISS AN ISSUE</div>
              <h3 className="jnews-inset-title" id="journal-letter-title">
                One letter, <em>once a month</em>.
              </h3>
              <p className="jnews-inset-sub">
                Recaps, essays, and career talks — the moment they go live. No spam, ever.
              </p>
              <form className="jnews-inset-form" onSubmit={submit}>
                <label className="sr-only" htmlFor="journal-letter-email">Email address</label>
                <input
                  id="journal-letter-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  tabIndex={newsletterReady ? undefined : -1}
                  required
                />
                <button type="submit" tabIndex={newsletterReady ? undefined : -1}>
                  {done ? '✓ SUBSCRIBED' : <><span>SUBSCRIBE</span> <ArrowRight color="#0a1f29" size={14} /></>}
                </button>
              </form>
            </div>
            <div className="jnews-inset-side" aria-hidden="true">
              Letters from the field, written by the people who&apos;ve walked it.
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ===== PAGE ROOT ===== */
export function JournalPage() {
  const [filter, setFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openArticle = (article) => {
    setSelectedArticle(article);
    window.history.replaceState(null, '', `/journal#${article.id}`);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    window.history.replaceState(null, '', '/journal');
  };

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      const article = ARTICLES.find((item) => item.id === id);
      if (article) setSelectedArticle(article);
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const [featured, ...rest] = ARTICLES;
  const sorted = rest.filter((a) => filter === 'all' || a.cat === filter);
  return (
    <main className="journal-page">
      <JournalHero />
      <JournalFeatured article={featured} onOpen={openArticle} />
      <JournalGrid articles={sorted} filter={filter} onFilter={setFilter} onOpen={openArticle} />

      {sorted.length === 0 && (
        <div className="jgrid-empty">
          <p>Nothing in <em>&ldquo;{CATEGORIES.find((c) => c.id === filter)?.label}&rdquo;</em> yet.</p>
          <button className="btn btn-ghost" onClick={() => setFilter('all')}>
            Show all
          </button>
        </div>
      )}

      <section className="jload-sec">
        <div className="jload" aria-live="polite">
          You&apos;re caught up — more stories arrive once a month.
          <a className="jload-link" href="#journal-letter">
            Get the monthly letter <ArrowRight color="#fff" size={14} />
          </a>
        </div>
        <div className="jload-foot">
          <span>
            {filter === 'all'
              ? `ALL ${ARTICLES.length} ARTICLES`
              : `${sorted.length} ${CATEGORIES.find((c) => c.id === filter)?.label.toUpperCase()}`}
          </span>
        </div>
      </section>

      <JournalLettersTransition />
      {selectedArticle && <JournalReader article={selectedArticle} onClose={closeArticle} />}
    </main>
  );
}
